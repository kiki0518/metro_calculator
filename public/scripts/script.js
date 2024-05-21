document.addEventListener("DOMContentLoaded", function() {
    const startStationSelect = document.getElementById("start-station");
    const endStationSelect = document.getElementById("end-station");

    fetch('/api/fares')
        .then(response => response.json())
        .then(data => {
            const fares = data.result.results;
            console.log(fares);
            const stations = new Set();
            fares.forEach(fare => {
                stations.add(fare['起站']);
                stations.add(fare['訖站']);
            });

            startStationSelect.innerHTML = '<option value="">請選擇</option>';
            endStationSelect.innerHTML = '<option value="">請選擇</option>';

            stations.forEach(station => {
                const option1 = document.createElement("option");
                option1.value = station;
                option1.textContent = station;
                startStationSelect.appendChild(option1);

                const option2 = document.createElement("option");
                option2.value = station;
                option2.textContent = station;
                endStationSelect.appendChild(option2);
            });

            document.getElementById("calculate-btn").addEventListener("click", () => calculateFare(fares));
        })
        .catch(error => console.error('Error fetching data:', error));

    function calculateFare(fares) {
        const startStation = startStationSelect.value;
        const endStation = endStationSelect.value;

        if (startStation && endStation) {
            const fareInfo = fares.find(fare => {
                console.log(`Checking fare: 起站=${fare['起站']}, 訖站=${fare['訖站']}`);
                return fare['起站'] === startStation && fare['訖站'] === endStation;
            });
            
            if (fareInfo) {
                const dailyFare = parseInt(fareInfo['全票票價'], 10);
                const tripsPerDay = 2;
                const workDaysPerMonth = 22;
                const totalTrips = tripsPerDay * workDaysPerMonth;

                const monthlyFare = dailyFare * totalTrips;
                const monthlyPass = 1200;

                let loyaltyDiscountRate;
                if (totalTrips > 50) {
                    loyaltyDiscountRate = 0.30;
                } else if (totalTrips > 40) {
                    loyaltyDiscountRate = 0.25;
                } else if (totalTrips > 30) {
                    loyaltyDiscountRate = 0.20;
                } else if (totalTrips > 20) {
                    loyaltyDiscountRate = 0.15;
                } else if (totalTrips > 10) {
                    loyaltyDiscountRate = 0.10;
                } else {
                    loyaltyDiscountRate = 0.00;
                }

                const loyaltyCashback = monthlyFare * loyaltyDiscountRate;

                const resultDiv = document.getElementById("result");
                resultDiv.innerHTML = `
                    <p>每天上下班費用: ${dailyFare * tripsPerDay} 元</p>
                    <p>每月上下班總費用: ${monthlyFare} 元</p>
                    <p>月票價格: 1200 元</p>
                    <p>忠誠度現金回饋: ${loyaltyCashback.toFixed(2)} 元</p>
                    <p>最終建議: ${monthlyFare - loyaltyCashback > monthlyPass ? "購買月票" : "使用忠誠度現金回饋"} 比較划算</p>
                `;
            } else {
                alert("未找到該路線的票價信息。");
            }
        } else {
            alert("請選擇起點站和終點站。");
        }
    }
});
