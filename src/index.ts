function factorial(num: number){
    let fact = 1;
    for (let i = 1; i <= num; i++) {
        fact = fact * i;
    }
    console.log(fact);
}
factorial(5);
factorial(4);
factorial(1);
