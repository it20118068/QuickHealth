import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-svg-charts';

const UserPieChart = ({ data }) => {
  const pieData = Object.keys(data).map((key, index) => ({
    value: data[key],
    svg: {
      fill: `rgba(134, 65, 244, ${0.8 * (index + 1) / Object.keys(data).length})`,
      onPress: () => console.log('press', index),
    },
    key: `pie-${index}`,
  }));

  return (
    <View style={{ height: 200, flexDirection: 'row' }}>
      <PieChart style={{ flex: 1 }} data={pieData} />
    </View>
  );
};

export default UserPieChart;
