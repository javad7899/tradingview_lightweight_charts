
import dateTimeToMilliseconds from "./dateTimeToMilliseconds";

export default function renameKeys(jsonObjectArray) {
    const renamedArray = [];
    const keyMap = {
        "Date": "date",
        "Time": "time",
        "Open": "open",
        "High": "high",
        "Low": "low",
        "Last": "close",
    };
    Array.isArray(jsonObjectArray) && jsonObjectArray.forEach(obj => {
        const renamedObject = {};
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                let newKey = keyMap[key] || key;
                if (key === "Date" && obj["Time"]) {
                    const milliseconds = dateTimeToMilliseconds(obj["Date"], obj["Time"]);
                    renamedObject["time"] = milliseconds;
                } else if (key !== "Time") {
                    renamedObject[newKey] = parseFloat(obj[key]);
                }
            }
        }
        renamedArray.push(renamedObject);
    });
    return renamedArray;
}

