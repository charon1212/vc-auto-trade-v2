import { useDateSelector } from './useDateSelector';

const Main = () => {
  const { date, setDate, DateSelector } = useDateSelector();

  return (
    <>
      <DateSelector />
    </>
  );
};

export default Main;
