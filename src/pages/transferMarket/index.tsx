import { Button, toast } from '@/components/ui';
import { useFetch } from '@/hooks/useAppUtils';
import { getErrorResponseMessage } from '@/lib/utils';
import { AuthContext } from '@/providers/context';
import { LogOutIcon } from 'lucide-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { MarketFilters } from './filters';
import { Market } from './market';
import { Team } from './team';

export const TransferMarket = () => {
  const { userData, removeUserData } = useContext(AuthContext);

  const [marketQueryParams, setMarketQueryParams] = useState<
    Record<string, unknown | any>
  >({});

  const {
    isLoading: isGetTeamLoading,
    isError: isGetTeamError,
    data: getTeamRes,
    error: getTeamError,
    fetcher: getTeam,
    // refetch: refetchTeamData,
  } = useFetch('team');

  const {
    isLoading: isGetTransferMarketLoading,
    // isSuccess: isGetTransferMarketSuccess,
    isError: isGetTransferMarketError,
    data: getTransferMarketRes,
    error: getTransferMarketError,
    fetcher: getTransferMarketData,
    refetch: refetchTransferMarketData,
  } = useFetch('transferMarket');

  const fetchTransferMarketData = useCallback(() => {
    getTransferMarketData({
      params: marketQueryParams,
    });
  }, [getTransferMarketData, marketQueryParams]);

  useEffect(() => {
    fetchTransferMarketData();
  }, [fetchTransferMarketData]);

  useEffect(() => {
    if (isGetTransferMarketError || isGetTeamError) {
      toast.error(
        getErrorResponseMessage(getTransferMarketError || getTeamError)
      );
    }
  }, [
    isGetTransferMarketError,
    getTransferMarketError,
    isGetTeamError,
    getTeamError,
  ]);

  const handleOnUpdateMarketQueryParams = useCallback(
    (params: Record<string, unknown | any>) => {
      setMarketQueryParams((prevState) => ({ ...prevState, ...params }));
    },
    []
  );

  return (
    <div className='p-4 h-dvh flex flex-col gap-4'>
      {/* header */}
      <nav className='rounded-lg shadow h-20 flex justify-between items-center px-4 py-2'>
        <h3 className='font-bold text-lg'>Football Manager</h3>
        <div className='flex items-center gap-6'>
          <h4 className='font-semibold text-base'>
            Welcome! {userData?.user?.email}
          </h4>
          <Button variant={'outline'} size={'icon'} onClick={removeUserData}>
            <LogOutIcon />
          </Button>
        </div>
      </nav>
      <div className='grid grid-cols-12 gap-4 h-full'>
        {/* filters */}
        <aside className='col-span-3'>
          <MarketFilters
            setMarketFilterQueryParams={handleOnUpdateMarketQueryParams}
          />
        </aside>
        {/* transfer market */}
        <main className='col-span-5'>
          <Market
            transferMarketData={getTransferMarketRes?.data}
            isMarketLoading={isGetTransferMarketLoading}
            teamData={getTeamRes?.data}
            setPaginationQueryParams={handleOnUpdateMarketQueryParams}
            refetchMarketData={refetchTransferMarketData}
            fetchTeamData={getTeam}
          />
        </main>
        {/* user team */}
        <aside className='col-span-4'>
          <Team
            refetchMarketData={refetchTransferMarketData}
            fetchTeamData={getTeam}
            isTeamLoading={isGetTeamLoading}
            teamData={getTeamRes?.data}
          />
        </aside>
      </div>
    </div>
  );
};
