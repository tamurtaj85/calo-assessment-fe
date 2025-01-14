import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  toast,
} from '@/components/ui';
import { useFetch } from '@/hooks/useAppUtils';
import { getErrorResponseMessage } from '@/lib/utils';
import React, { ChangeEvent, useEffect, useState } from 'react';

export const Market: React.FC<{
  transferMarketData: Record<string, unknown | any> | null;
  isMarketLoading: boolean;
  teamData: Record<string, unknown | any> | null;
  setPaginationQueryParams: (params: Record<string, unknown | any>) => void;
  refetchMarketData: () => void;
  fetchTeamData: () => void;
}> = ({
  transferMarketData,
  isMarketLoading,
  teamData,
  setPaginationQueryParams,
  fetchTeamData,
  refetchMarketData,
}) => {
  const [marketPaginationParams, setMarketPaginationParams] = useState<{
    page: number;
    limit: number;
  }>({ limit: 10, page: 1 });

  const {
    isLoading: isBuyPlayerLoading,
    isSuccess: isBuyPlayerSuccess,
    isError: isBuyPlayerError,
    error: buyPlayerError,
    fetcher: buyPlayerFromMarket,
  } = useFetch(`transferMarket/buyPlayer`);

  const {
    isLoading: isDelistPlayerLoading,
    isSuccess: isDelistPlayerSuccess,
    isError: isDelistPlayerError,
    error: delistPlayerError,
    fetcher: delistPlayerFromMarket,
  } = useFetch(`player/delistOnMarket`);

  useEffect(() => {
    if (isBuyPlayerSuccess) {
      toast.success('Player bought successfully!');
      fetchTeamData();
      refetchMarketData();
    }
  }, [isBuyPlayerSuccess, fetchTeamData, refetchMarketData]);

  useEffect(() => {
    if (isDelistPlayerSuccess) {
      toast.success('Player removed from transfer market list successfully!');
      fetchTeamData();
      refetchMarketData();
    }
  }, [isDelistPlayerSuccess, fetchTeamData, refetchMarketData]);

  useEffect(() => {
    if (isBuyPlayerError || isDelistPlayerError) {
      toast.error(getErrorResponseMessage(buyPlayerError || delistPlayerError));
    }
  }, [
    isBuyPlayerError,
    buyPlayerError,
    isDelistPlayerError,
    delistPlayerError,
  ]);

  useEffect(() => {
    setPaginationQueryParams(marketPaginationParams);
  }, [marketPaginationParams, setPaginationQueryParams]);

  const updatePageNumber = (newPageNumber: number) => {
    if (newPageNumber >= 1 && newPageNumber <= transferMarketData?.totalPages) {
      setMarketPaginationParams((prevState) => ({
        ...prevState,
        page: newPageNumber,
      }));
    }
  };

  const handleOnClickPageChange = (mode: 'prev' | 'next') => () => {
    if (mode === 'next') updatePageNumber(marketPaginationParams.page + 1);
    if (mode === 'prev') updatePageNumber(marketPaginationParams.page - 1);
  };

  const handleOnChangePageInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);

    updatePageNumber(value);
  };

  const handleOnChangePageSize = (value: string) => {
    setMarketPaginationParams((prevState) => ({
      ...prevState,
      limit: parseInt(value),
    }));
  };

  return (
    <Card className='flex flex-col h-[90dvh]'>
      <CardHeader className='bg-slate-50 rounded-[inherit]'>
        <CardTitle>Transfer Market</CardTitle>
        <CardDescription>
          Buy players from other teams at the 95% of their asking price!
        </CardDescription>
        <div className='flex items-center justify-between gap-4 pt-4'>
          <Select
            value={marketPaginationParams.limit.toString()}
            onValueChange={handleOnChangePageSize}
          >
            <SelectTrigger className='w-36 border-none'>
              Page Size: <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
          <div className='flex gap-1'>
            <Button
              variant={'outline'}
              onClick={handleOnClickPageChange('prev')}
            >
              Prev
            </Button>
            <div className='inline-flex items-center gap-1'>
              <Input
                className='w-10 text-center border-none'
                min={1}
                max={transferMarketData?.totalPages}
                value={marketPaginationParams.page}
                onChange={handleOnChangePageInput}
              />
              <p>/ {transferMarketData?.totalPages || 1}</p>
            </div>
            <Button
              variant={'outline'}
              onClick={handleOnClickPageChange('next')}
            >
              Next
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex-1 overflow-y-auto'>
        {isMarketLoading ? (
          <div className='space-y-6'>
            <div className='space-y-2 border rounded-lg p-4'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-4/6' />
            </div>
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
          <div className='grid grid-cols-4 gap-4'>
            {transferMarketData?.marketData?.map(
              (player: Record<string, unknown | any>) => (
                <PlayerListingCard
                  key={player?._id}
                  playerData={player}
                  isUsersTeam={player?.team?._id === teamData?._id}
                  onClickBuyPlayer={(playerId) =>
                    buyPlayerFromMarket({ params: { playerId } })
                  }
                  onClickDelistPlayer={(playerId) =>
                    delistPlayerFromMarket({ params: { playerId } })
                  }
                  buyPlayerDisabled={isBuyPlayerLoading}
                  delistPlayerDisabled={isDelistPlayerLoading}
                />
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

type PlayerListingCardProps = {
  playerData: Record<string, unknown | any>;
  isUsersTeam: boolean;
  onClickBuyPlayer: (playerId: string) => void;
  onClickDelistPlayer: (playerId: string) => void;
  buyPlayerDisabled?: boolean;
  delistPlayerDisabled?: boolean;
};

const PlayerListingCard: React.FC<PlayerListingCardProps> = ({
  playerData,
  isUsersTeam = false,
  onClickBuyPlayer,
  onClickDelistPlayer,
  buyPlayerDisabled,
  delistPlayerDisabled,
}) => {
  return (
    <Card className='col-span-2 flex flex-col justify-between'>
      <CardHeader className=''>
        <CardTitle className='flex gap-2'>{playerData?.name}</CardTitle>
        <CardDescription>
          <p className='font-semibold'>{playerData?.position}</p>
          <p>{playerData?.team?.name}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col items-end gap-2'>
        <h6 className='font-bold text-primary'>${playerData?.askingPrice}</h6>
        <div className='flex justify-end gap-2 w-full'>
          {isUsersTeam && (
            <Button
              className='basis-1/2'
              size={'sm'}
              variant={'secondary'}
              onClick={() => onClickDelistPlayer(playerData?._id)}
              disabled={delistPlayerDisabled}
            >
              Delist Player
            </Button>
          )}
          <Button
            className='basis-1/2'
            size={'sm'}
            onClick={() => onClickBuyPlayer(playerData?._id)}
            disabled={buyPlayerDisabled || isUsersTeam}
          >
            Buy Player
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
