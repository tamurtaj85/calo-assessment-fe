import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Separator,
  Skeleton,
  toast,
} from '@/components/ui';
import { useFetch } from '@/hooks/useAppUtils';
import { getErrorResponseMessage } from '@/lib/utils';
import { CircleDollarSign, LandPlot, UserRound } from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

export const Team: React.FC<{
  refetchMarketData: () => void;
  fetchTeamData: () => void;
  teamData: Record<string, unknown | any> | null;
  isTeamLoading: boolean;
}> = ({ refetchMarketData, fetchTeamData, teamData, isTeamLoading }) => {
  const [refetchCount, setRefetchCount] = useState(0);
  const [isWaitingForTeam, setIsWaitingForTeam] = useState(false);

  const [playerToListOnMarket, setPlayerToListOnMarket] = useState<Record<
    string,
    unknown | any
  > | null>(null);

  const [askingPriceForPlayer, setAskingPriceForPlayer] = useState<
    number | string
  >('');

  const [dialogOpen, setDialogOpen] = useState(false);

  const intervalIdRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const {
    isLoading: isGetIsTeamCreatedLoading,
    isSuccess: isGetIsTeamCreatedSuccess,
    isError: isGetIsTeamCreatedError,
    data: getIsTeamCreatedRes,
    error: getIsTeamCreatedError,
    fetcher: getTeamCreationStatus,
  } = useFetch('user/teamCreationStatus');

  const {
    isLoading: isPlayerListOnMarketLoading,
    isSuccess: isPlayerListOnMarketSuccess,
    isError: isPlayerListOnMarketError,
    error: playerListOnMarketError,
    fetcher: playerListOnMarket,
  } = useFetch('player/listOnMarket');

  // useImperativeHandle(teamRef, () => ({ refetchTeamData: getTeam }));

  useEffect(() => {
    getTeamCreationStatus();
  }, [getTeamCreationStatus]);

  useEffect(() => {
    if (
      isGetIsTeamCreatedSuccess &&
      getIsTeamCreatedRes?.data?.status === false &&
      !intervalIdRef.current
    ) {
      intervalIdRef.current = setInterval(() => {
        getTeamCreationStatus();
        setRefetchCount((prevState) => prevState + 1);
      }, 30 * 1000);

      setIsWaitingForTeam(true);
    } else if (getIsTeamCreatedRes?.data?.status) {
      clearInterval(intervalIdRef.current);
      setRefetchCount(0);
      setIsWaitingForTeam(false);
      fetchTeamData();
    }
  }, [
    getTeamCreationStatus,
    isGetIsTeamCreatedSuccess,
    getIsTeamCreatedRes,
    fetchTeamData,
  ]);

  useEffect(() => {
    if (refetchCount >= 3) {
      clearInterval(intervalIdRef.current);
      toast.error('Your team is not ready yet! Please try again later.');
      setIsWaitingForTeam(false);
      setRefetchCount(0);
    }
  }, [refetchCount]);

  useEffect(() => {
    if (isPlayerListOnMarketSuccess) {
      toast.success('Player listed on market successfully!');
      fetchTeamData();
      refetchMarketData();
      setPlayerToListOnMarket(null);
      setAskingPriceForPlayer(0);
      setDialogOpen(false);
    }
  }, [isPlayerListOnMarketSuccess, fetchTeamData, refetchMarketData]);

  useEffect(() => {
    if (isGetIsTeamCreatedError || isPlayerListOnMarketError) {
      toast.error(
        getErrorResponseMessage(
          getIsTeamCreatedError || playerListOnMarketError
        )
      );
    }
  }, [
    isGetIsTeamCreatedError,
    getIsTeamCreatedError,
    isPlayerListOnMarketError,
    playerListOnMarketError,
  ]);

  const handleOnClickListOnMarket = (player: Record<string, unknown | any>) => {
    setPlayerToListOnMarket(player);
    setDialogOpen(true);
  };

  const handleOnClickTransfer = (event: FormEvent) => {
    event.preventDefault();

    playerListOnMarket({
      method: 'patch',
      data: { askingPrice: askingPriceForPlayer },
      params: { playerId: playerToListOnMarket?._id },
    });
  };

  return (
    <>
      <Card className='flex flex-col h-[90dvh]'>
        <CardHeader className='bg-gray-100 rounded-[inherit]'>
          <CardTitle>Your Team Info</CardTitle>
          <CardDescription className='text-black'>
            <h3 className='text-lg font-extrabold flex gap-2 items-center'>
              <span className='text-muted-foreground'>
                <LandPlot />
              </span>
              {teamData?.name ?? 'N/A'}
            </h3>
            <h3 className='text-lg font-extrabold flex gap-2 items-center'>
              <span className='text-muted-foreground'>
                <CircleDollarSign />
              </span>
              {teamData?.budget ?? 0} Budget
            </h3>
            <h3 className='text-lg font-extrabold flex gap-2 items-center'>
              <span className='text-muted-foreground'>
                <UserRound />
              </span>
              {teamData?.players?.length ?? 0} Members
            </h3>
          </CardDescription>
        </CardHeader>
        <CardContent className='flex-1 overflow-y-auto px-4'>
          {isTeamLoading ||
          isWaitingForTeam ||
          isGetIsTeamCreatedLoading ||
          isPlayerListOnMarketLoading ? (
            <div className='space-y-6'>
              {isWaitingForTeam && (
                <p className='text-muted-foreground'>
                  Please wait while we create a team for you!
                </p>
              )}
              <div className='space-y-2 border rounded-lg p-4'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-4/6' />
              </div>
              <div className='space-y-2 border rounded-lg p-4'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-4/6' />
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              {/* render players */}
              <div className='flex flex-col gap-2'>
                {teamData?.players
                  ?.filter(
                    (player: Record<string, unknown | any>) =>
                      player?.onTransferList === false
                  )
                  ?.map((player: Record<string, unknown | any>) => (
                    <TeamMemberCard
                      key={player?._id}
                      memberData={player}
                      onClickListOnMarket={handleOnClickListOnMarket}
                    />
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className='hidden' />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer player to market</DialogTitle>
            <DialogDescription>
              Fill in the asking price for {playerToListOnMarket?.name} (
              <span className='mx-1'>{playerToListOnMarket?.position}</span>)
              against given price of {playerToListOnMarket?.price}$
            </DialogDescription>
          </DialogHeader>
          <div>
            <form className='flex gap-4' onSubmit={handleOnClickTransfer}>
              <Input
                placeholder='Asking price for player'
                required
                inputMode='numeric'
                min={0}
                minLength={1}
                maxLength={7}
                pattern={'\\d+'}
                defaultValue={playerToListOnMarket?.price}
                onChange={(e) => setAskingPriceForPlayer(+e.target.value)}
              />
              <Button type='submit'>Transfer</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

type TeamMemberCardProps = {
  memberData: Record<string, unknown | any>;
  onClickListOnMarket: (playerData: Record<string, unknown | any>) => void;
};

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  memberData,
  onClickListOnMarket,
}) => {
  const handleOnClickListOnMarket = () => {
    onClickListOnMarket(memberData);
  };

  return (
    <Card className='flex justify-between'>
      <CardHeader className='p-3'>
        <CardTitle className='flex gap-2'>{memberData?.name}</CardTitle>
        <CardDescription className='flex items-center gap-2'>
          <span>{memberData?.position}</span>
          <Separator orientation='vertical' className='h-5' />
          <span>{memberData?.price} $</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='p-3 my-auto'>
        <Button
          variant={'link'}
          size={'sm'}
          onClick={handleOnClickListOnMarket}
        >
          List on market
        </Button>
      </CardContent>
    </Card>
  );
};
