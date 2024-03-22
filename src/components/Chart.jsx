import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createChart } from "lightweight-charts";
import renameKeys from "../utils/renameKeys";

const Chart = ({ data }) => {

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const cursorPriceLines = useRef([null, null]);
  const renamedData = renameKeys(data);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current);
    chartRef.current = chart;

    chart.applyOptions({
      layout: {
        background: { color: "#222" },
        textColor: "#fff",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chart.timeScale().fitContent();

    const candleStickSeries = chart.addCandlestickSeries();

    candleStickSeries.setData(renamedData);

    candleStickSeries.applyOptions({
      wickUpColor: "rgb(54, 116, 217)",
      upColor: "rgb(54, 116, 217)",
      wickDownColor: "rgb(225, 50, 85)",
      downColor: "rgb(225, 50, 85)",
      borderVisible: false,
      priceScaleId: "right",
    });

    chart.subscribeCrosshairMove((param) => {
      if (!param.time) return;
      const candlePrice = param.seriesData.get(candleStickSeries);
      cursorPriceLines.current.forEach(
        (priceLine) => priceLine && candleStickSeries.removePriceLine(priceLine)
      );

      const minPriceLine = candleStickSeries.createPriceLine({
        price: Number(candlePrice?.low),
        color: "#ef5350",
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: "low",
      });
      const maxPriceLine = candleStickSeries.createPriceLine({
        price: Number(candlePrice?.high),
        color: "#26a69a",
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: "high",
      });

      cursorPriceLines.current = [minPriceLine, maxPriceLine];
    });

    const max = Math.max(...renamedData.map((item) => parseFloat(item.high)));
    const maxHighTime = renamedData.find(
      (item) => parseFloat(item.high) === max
    ).time;
    const min = Math.min(...renamedData.map((item) => parseFloat(item.low)));
    const minLowTime = renamedData.find(
      (item) => parseFloat(item.low) === min
    ).time;

    const markers = [
      {
        time: maxHighTime,
        position: "aboveBar",
        color: "#26a69a",
        shape: "arrowDown",
        text: "Highest high",
        size: 1,
      },
      {
        time: minLowTime,
        position: "belowBar",
        color: "#ef5350",
        shape: "arrowUp",
        text: "Lowest low",
        size: 1,
      },
    ].sort((a, b) => a.time - b.time);
    candleStickSeries.setMarkers(markers);


    chart.timeScale().applyOptions({
      tickMarkFormatter: (time) => {
        const date = new Date(time);
        const myDate = `${date.toLocaleDateString("en-US")}  ${date.getHours()}:${date.getMinutes()}`
        return myDate
      }
    })

  }, [renamedData]);

  useEffect(() => {
    const handleResize = () => {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="chartContainer" />;
};

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Date: PropTypes.string.isRequired,
      Time: PropTypes.string.isRequired,
      Open: PropTypes.string.isRequired,
      High: PropTypes.string.isRequired,
      Low: PropTypes.string.isRequired,
      Last: PropTypes.string.isRequired,
      Volume: PropTypes.string,
      NumberOfTrades: PropTypes.string,
      BidVolume: PropTypes.string,
      AskVolume: PropTypes.string,
    })
  ).isRequired,
};

export default Chart;
