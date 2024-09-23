<div class="form-container">
   <h2>Create Your Account</h2>
   <form id="userForm">
     <div class="input-group">
       <label for="username">Username</label>
       <div>
       </div>
       <input type="text" id="username" placeholder="Enter your username" @input={onUserNameChange}/>
     </div>
     <div class="input-group">
       <label for="password">Password</label>
       <input type="password" id="password" placeholder="Enter your password" @change={onPasswordChange} />
     </div>
     <button type="button" @click={submit}>Create Account</button>
   </form>
 </div>