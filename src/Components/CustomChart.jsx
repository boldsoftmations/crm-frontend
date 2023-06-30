import React from "react";
import Chart from "react-google-charts";

export const CustomChart = (props) => {
  const { chartType, data, options, widthStyle, heightStyle, onClickType } =
    props;

  return (
    <div>
      {data.length > 0 ? (
        <Chart
          chartType={chartType}
          data={data}
          options={options}
          width={widthStyle}
          height={heightStyle}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};
