import { Tab, Tabs } from '@mui/material';
import { Box, SxProps, Theme } from '@mui/system';
import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role='tabpanel' hidden={value !== index} style={{ flex: 1, minHeight: '0', overflowY: 'auto' }} {...other}>
      {value === index && <Box sx={{ padding: '3px' }}>{children} </Box>}
    </div>
  );
}

type Props = {
  tabs: { title: string; contents: JSX.Element }[];
};
const MyTabContainer = (props: Props) => {
  const { tabs } = props;
  const [value, setValue] = React.useState(0);
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={(e, v) => setValue(v)}>
          {tabs.map((v, i) => (
            <Tab label={v.title} key={i} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((v, i) => (
        <TabPanel value={value} index={i} key={i}>
          {v.contents}
        </TabPanel>
      ))}
    </>
  );
};

export default MyTabContainer;
