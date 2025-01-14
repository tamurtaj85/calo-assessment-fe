import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from '@/components/ui';
import { ChangeEvent, useState } from 'react';

export const MarketFilters: React.FC<{
  setMarketFilterQueryParams: (params: Record<string, unknown | any>) => void;
}> = ({ setMarketFilterQueryParams }) => {
  const [marketQueryParams, setMarketQueryParams] = useState<{
    teamName: string;
    playerName: string;
    askingPrice: number | string;
  }>({
    teamName: '',
    playerName: '',
    askingPrice: '',
  });

  const handleOnChangeMarketFilters = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setMarketQueryParams((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleOnClickApplyFilter = () => {
    if (Object.values(marketQueryParams).every((param) => param === '')) return;

    setMarketFilterQueryParams(marketQueryParams);
  };

  const handleOnClickClearFilter = () => {
    const resetPayload = {
      teamName: '',
      playerName: '',
      askingPrice: '',
    };

    setMarketQueryParams(resetPayload);
    setMarketFilterQueryParams(resetPayload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Team(s)</CardTitle>
        <CardDescription>
          Search by team name, player name or max asking price!
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className='space-y-2'>
        <div className='space-y-1'>
          <Label>Team Name</Label>
          <Input
            name='teamName'
            value={marketQueryParams.teamName}
            onChange={handleOnChangeMarketFilters}
            placeholder='Search by team name'
          />
        </div>
        <div className='space-y-1'>
          <Label>Player Name</Label>
          <Input
            name='playerName'
            value={marketQueryParams.playerName}
            onChange={handleOnChangeMarketFilters}
            placeholder='Search by player name'
          />
        </div>
        <div className='space-y-1'>
          <Label>Max Asking Price</Label>
          <Input
            name='askingPrice'
            inputMode='numeric'
            pattern={'\\d+'}
            maxLength={7}
            value={marketQueryParams.askingPrice}
            onChange={handleOnChangeMarketFilters}
            placeholder='Search by asking price'
          />
        </div>
        <div className='flex gap-2 pt-2'>
          <Button className='w-full' onClick={handleOnClickApplyFilter}>
            Apply Filter
          </Button>
          <Button variant={'secondary'} onClick={handleOnClickClearFilter}>
            Clear Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
