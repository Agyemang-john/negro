import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function CustomTabs({ tabLabels, tabContents }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  

  return (
    <Box sx={{width: "100%", bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={true}
        aria-label="scrollable prevent tabs example"
      >
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
      <Box sx={{ padding: 3 }}>
        {tabContents[value]}
      </Box>
    </Box>
  );
}
