// DOM 요소들 가져오기
const inputMin = document.getElementById('inputMin');
const inputMax = document.getElementById('inputMax');
const inputValue = document.getElementById('inputValue');
const outputMin = document.getElementById('outputMin');
const outputMax = document.getElementById('outputMax');

// 시각화 바 요소들
const inputBarFill = document.getElementById('inputBarFill');
const inputMarker = document.getElementById('inputMarker');
const inputMarkerValue = document.getElementById('inputMarkerValue');
const inputMinLabel = document.getElementById('inputMinLabel');
const inputMaxLabel = document.getElementById('inputMaxLabel');

const outputBarFill = document.getElementById('outputBarFill');
const outputMarker = document.getElementById('outputMarker');
const outputMarkerValue = document.getElementById('outputMarkerValue');
const outputMinLabel = document.getElementById('outputMinLabel');
const outputMaxLabel = document.getElementById('outputMaxLabel');
const outputValue = document.getElementById('outputValue');

// 값 범위 변환 함수
function convertValue(inputVal, inMin, inMax, outMin, outMax) {
    // 입력 범위가 0인 경우 처리
    if (inMax === inMin) {
        return outMin;
    }

    // 선형 변환 공식 적용
    const normalizedValue = (inputVal - inMin) / (inMax - inMin);
    const convertedValue = outMin + normalizedValue * (outMax - outMin);

    return convertedValue;
}

// 시각화 바 업데이트 함수
function updateVisualizationBars(inputVal, inMin, inMax, outputVal, outMin, outMax) {
    // 입력 범위 바 업데이트
    const inputPercentage = ((inputVal - inMin) / (inMax - inMin)) * 100;
    inputBarFill.style.width = `${Math.max(0, Math.min(100, inputPercentage))}%`;
    inputMarker.style.left = `${Math.max(0, Math.min(100, inputPercentage))}%`;
    inputMarkerValue.textContent = Number(inputVal.toFixed(2));

    // 출력 범위 바 업데이트
    const outputPercentage = ((outputVal - outMin) / (outMax - outMin)) * 100;
    outputBarFill.style.width = `${Math.max(0, Math.min(100, outputPercentage))}%`;
    outputMarker.style.left = `${Math.max(0, Math.min(100, outputPercentage))}%`;
    outputMarkerValue.textContent = Number(outputVal.toFixed(4));

    // 출력값 필드 업데이트
    outputValue.value = Number(outputVal.toFixed(4));

    // 라벨 업데이트
    inputMinLabel.textContent = inMin;
    inputMaxLabel.textContent = inMax;
    outputMinLabel.textContent = outMin;
    outputMaxLabel.textContent = outMax;
}



// 실시간 업데이트를 위한 입력 이벤트 리스너
[inputMin, inputMax, inputValue, outputMin, outputMax].forEach(input => {
    input.addEventListener('input', () => {
        // 유효한 값들인지 확인 후 시각화 바 업데이트
        const values = {
            inputMin: parseFloat(inputMin.value),
            inputMax: parseFloat(inputMax.value),
            inputValue: parseFloat(inputValue.value),
            outputMin: parseFloat(outputMin.value),
            outputMax: parseFloat(outputMax.value)
        };

        // 모든 값이 유효한 숫자인지 확인
        const allValid = !isNaN(values.inputMin) && !isNaN(values.inputMax) &&
                        !isNaN(values.inputValue) && !isNaN(values.outputMin) && !isNaN(values.outputMax);

        if (allValid && values.inputMin < values.inputMax) {
            const convertedValue = convertValue(
                values.inputValue,
                values.inputMin,
                values.inputMax,
                values.outputMin,
                values.outputMax
            );
            updateVisualizationBars(
                values.inputValue,
                values.inputMin,
                values.inputMax,
                convertedValue,
                values.outputMin,
                values.outputMax
            );
        }
    });
});

// 초기 값 설정
window.addEventListener('load', () => {
    inputMin.value = '0';
    inputMax.value = '27648';
    inputValue.value = '13824';
    outputMin.value = '4';
    outputMax.value = '20';

    // 초기 시각화 바 업데이트
    const convertedValue = convertValue(13824, 0, 27648, 4, 20);
    updateVisualizationBars(13824, 0, 27648, convertedValue, 4, 20);
    outputValue.value = Number(convertedValue.toFixed(4));

    // PWA Service Worker 등록
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker 등록 성공:', registration);
            })
            .catch(error => {
                console.log('Service Worker 등록 실패:', error);
            });
    }
});