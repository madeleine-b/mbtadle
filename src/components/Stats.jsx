import { Icon } from 'semantic-ui-react';
import StatsBox from './StatsBox';
import StatsHistogram from './StatsHistogram';

const Stats = (props) => {
  const { stats, isDarkMode } = props;
  return (
    <>
      <StatsBox isDarkMode={isDarkMode} stats={stats} />
      <StatsHistogram isDarkMode={isDarkMode} stats={stats} />
    </>
  );
}

export default Stats;