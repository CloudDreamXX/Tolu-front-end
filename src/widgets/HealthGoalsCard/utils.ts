export function findPercentage(num1: number, num2: number): number {
    if(num1 > 0 && num2 > 0) {
        return (num1 / num2) * 100;
    }
    return 0;
}

findPercentage(2, 5); 