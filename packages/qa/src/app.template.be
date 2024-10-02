@if(a%2===0){
 @if(a%4===0){
  <h1>a {a + ' '} is even and divisible by 4 </h1>
 }
 @else{
  <h1>a {a + ' '} is even but not divisible by 4 </h1>
 }
}
@else{
 <h1>a {a + ' '} is odd</h1>
}