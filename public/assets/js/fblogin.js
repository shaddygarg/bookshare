
function statusChangeCallback(response) {
 console.log('statusChangeCallback');
 console.log(response);
 if (response.status === 'connected') {
  testAPI();
} else if (response.status === 'not_authorized') {
  document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
} else {
  document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
}
}

function checkLoginState() {
 FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});
}

window.fbAsyncInit = function() {
 FB.init({
   appId      : '191556834656617',
   xfbml      : true,
   version    : 'v2.8'
 });

 FB.getLoginStatus(function(response) {
   statusChangeCallback(response);
 });

 FB.AppEvents.logPageView();
};
(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function testAPI() {
 console.log('Welcome!  Fetching your information.... ');
 FB.api('/me', function(response) {
   console.log('Successful login for: ' + response.name);
   document.getElementById('status').innerHTML =
   'Thanks for logging in, ' + response.name + '!';
 });
}
