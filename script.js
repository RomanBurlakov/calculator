document.addEventListener('DOMContentLoaded', () => {
	const input = document.querySelector('.input');
	const screen = document.querySelector('.screen');
	let number1, number2, operandIndex;

	function setOperand(operand) {
		if (input.textContent === 'Невыполнимая операция!') return;
		if (operandIndex !== undefined && operandIndex !== input.textContent.length - 1) calculate();
		if (input.textContent.at(-1) === '.') {
			input.textContent = input.textContent.slice(0, -1);
		}
		if (operandIndex !== undefined) {
			input.textContent = input.textContent.slice(0, -3);
		} else {
			if (number1 === undefined) {
				number1 = input.textContent;
			}
		}
		input.textContent += ` ${operand} `;
		operandIndex = input.textContent.length - 1;
	}

	function resetCalculator() {
		document.querySelectorAll('.history').forEach(e => {
			e.remove();
		})
		operandIndex = number1 = number2 = undefined;
		input.textContent = '0';
	}

	function addSymbol(symbol) {
		if (input.textContent === 'Невыполнимая операция!') {
			resetCalculator();
			input.textContent = symbol;
		} else {
			const currentNumber = input.textContent.slice(operandIndex + 1);
			if (currentNumber[0] === '0' && !currentNumber.includes('.')) {
				input.textContent = input.textContent.slice(0, -1);
			}
			input.textContent += symbol;
		}
	}

	function addDot() {
		if (/\D/.test(input.textContent.at(-1)) && input.textContent.at(-1) !== '.') {
			addSymbol('0.');
			return;
		}
		if (operandIndex === undefined && input.textContent.includes('.') || input.textContent.includes('.', operandIndex + 1)) {
			return;
		}
		input.textContent += '.';
	}

	function deleteSymbol() {
		if (input.textContent === 'Невыполнимая операция!') {
			addSymbol('0');
			return;
		} else if (input.textContent.length === 1) {
			input.textContent = '0';
			return;
		}
		if (operandIndex === input.textContent.length - 1) {
			operandIndex = undefined;
			input.textContent = input.textContent.slice(0, -3);
			return;
		}
		input.textContent = input.textContent.slice(0, -1);
	}

	function calculate(isPercent) {
		if (operandIndex === undefined || input.textContent.at(-1) === '-' || input.textContent.at(-1) === ' ') return;
		if (input.textContent.at(-1) === '.') {
			input.textContent = input.textContent.slice(0, -1);
		}
		if (isPercent) {
			number2 = +input.textContent.slice(operandIndex + 1);
			input.textContent += '%';
			if (input.textContent[operandIndex - 1] === '+' || input.textContent[operandIndex - 1] === '-') {
				number2 = number1 / 100 * number2;
			} else {
				number2 = number2 / 100;
			}
		} else {
			number2 = input.textContent.slice(operandIndex + 1);
		}

		let result = NaN;
		switch (input.textContent[operandIndex - 1]) {
			case '+':
				result = +number1 + +number2;
				break;
			case '-':
				result = number1 - number2;
				break;
			case '×':
				result = number1 * number2;
				break;
			case '/':
				result = number1 / number2;
				break;
		}

		const history = document.createElement('p');
		history.classList.add('history');
		history.textContent = input.textContent + ' =';
		screen.insertBefore(history, input);

		if (isFinite(result)) {
			const difference = Math.abs(result.toFixed(10) - result);
			if (difference > 0 && difference < 1e-10) {
				const fraction = result.toString().slice(result.toString().indexOf('.'));
				const last = Array.from(fraction.toString().matchAll(/([09])\1+/g)).at(-1)?.index;
				if (last) {
					input.textContent = +result.toFixed(last - 1);
				} else {
					input.textContent = result;
				}
			} else {
				input.textContent = result;
			}
		} else {
			input.textContent = 'Невыполнимая операция!';
		}
		operandIndex = number1 = number2 = undefined;
	}

	document.querySelector('#plus').addEventListener('click', () => setOperand('+'));

	document.querySelector('#minus').addEventListener('click', () => setOperand('-'));

	document.querySelector('#multiply').addEventListener('click', () => setOperand('×'));

	document.querySelector('#divide').addEventListener('click', () => setOperand('/'));

	document.querySelectorAll('.button.number').forEach((elem) => {
		elem.addEventListener('click', (event) => {
			addSymbol(event.target.textContent);
		});
	});

	document.querySelector('#dot').addEventListener('click', () => addDot());

	document.querySelector('#precent').addEventListener('click', () => calculate(true));

	document.querySelector('#equal').addEventListener('click', () => {
		console.time(1)
		calculate()
		console.timeEnd(1)
	});

	document.querySelector('#clear').addEventListener('click', () => resetCalculator());

	document.querySelector('#delete').addEventListener('click', () => deleteSymbol());

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') event.preventDefault();
		if (+event.key >= 0 && +event.key <= 9 && event.key !== ' ') {
			addSymbol(event.key);
		} else {
			switch (event.key) {
				case '+':
					setOperand('+');
					break;
				case '-':
					setOperand('-');
					break;
				case '*':
					setOperand('×');
					break;
				case '/':
					setOperand('/');
					break;
				case '.':
					addDot();
					break;
				case ',':
					addDot();
					break;
				case '%':
					calculate(true);
					break;
				case 'Backspace':
					deleteSymbol();
					break;
				case 'Enter':
					calculate();
					break;
				default:
					break;
			}
		}
	})
})