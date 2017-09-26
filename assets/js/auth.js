$(function() {
  $(document).ready(function () {
    $('form#login-form-submit').focus();
  });


  /* LOGIN FORM */
  $('#login-form-submit').submit(function (e) {
    console.log('login submit');

    e.preventDefault();
    let data = $(this).serializeObject();
    console.log('data', data);
    socket.post('/auth/local',data, function(result){
      // console.log('/auth/local', result);
      let { error, location, user } = result;

      // Authenticated
      if(user && location) {
        window.location = location;
      }

      // Show errors
      if(Array.isArray(error) && error.length > 0) {
        error.map(item => noty({ text: item, type: 'error' }));
      }
    });
  });

  /* REGISTER FORM */
  $('#register-form-submit').submit(function (e) {
    e.preventDefault();
    let data = $(this).serializeObject();
    if(data.password !== data.confirm_password){
      $('label[for=confirm_password]').attr('data-error','invalid password');
      $('input[name=confirm_password]').addClass('invalid').removeClass('valid validate');
      return false;
    }
    console.log('data', data);
    socket.post('/user/register',data, function(result){
      let { error, location, user } = result;
      console.log('register result', error);
      console.log('result', result);

      if(user && location) {
        window.location = location;
      }

      if(error){
        // return swal({
        //   text: error,
        //   icon: 'error',
        //   buttons: false
        // })

        return noty({
          text: error,
          type: 'error',
        });
      }
    });
  });




  /* DELETE SELLER */
  $('#seller-page a.del-seller-button').click(function(){
    let sellerId = $(this).parents('tr').find('td.sellerId').text();
    $(this).parents('tr').fadeOut('slow');
    $('#seller-page-notice').html('<div class="alert alert-success"><strong>Success!</strong> Delete a user.</div>');
    console.log('del seller '+sellerId)
    $.get('/')
  })

  /* VALIDATE RULES */
  $("#register-form-submit").validate({
    rules: {

      username:{
        required: true,
        minlength: 8
      },
      password: {
        required: true,
        minlength: 8
      },
      confirm_password: {
        required: true,
        minlength: 8,
        equalTo: "#password"
      }
    },
    //For custom messages
    messages: {
      username:{
        required: "Enter a username",
        minlength: "Enter at least 8 characters"
      },
      password:{
        minlength: "Enter at least 8 characters"
      },
      confirm_password:{
        minlength: "Enter at least 8 characters",
        equalTo:'not match'
      }
    },
    errorElement : 'div',
    errorPlacement: function(error, element) {
      let placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
  });

})
