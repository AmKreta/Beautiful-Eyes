@if(a%2==0){
  <div>
    @if(a%4 === 0){
      <h1>{a} {' '}is even and divisible by 4</h1>
    }
    @else-if(a%6 === 0){
      <h1>{a} {' '}is even and divisible by 6</h1>
    }
    @else-if(a%8 ===0){
      <h1>{a} {' '}is even and divisible by 8</h1>
    }
    @else{
      <h1>{a} {' '}is even and not divisible by 4, 6 and 8</h1>
    }
  </div>
}
@else{
  <div>
    @if(a%3 === 0){
      <h1>{a} {' '}is odd and divisible by 3</h1>
    }
    @else-if(a%5 === 0){
      <h1>{a} {' '}is odd and divisible by 5</h1>
    }
    @else-if(a%7 ===0){
      <h1>{a} {' '}is odd and divisible by 7</h1>
    }
    @else{
      <h1>{a} {' '}is odd and not divisible by 3, 5 and 7</h1>
    }
  </div>
}