$(function(){
  /*Preloader*/
  $(window).load(function() {
    setTimeout(function() {
      $('body').addClass('loaded');
      $('div#loader').remove();
    }, 200);
  });

  $('#nav-mobile .button-collapse').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'right', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true, // Choose whether you can drag to open on touch screens,
    onOpen: function(el) {
    }
  });

  $('#scp-menu-collapse .button-collapse').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true, // Choose whether you can drag to open on touch screens,
    // onOpen: function(eo) {
    //   $('#user-page nav a.page-title').css('margin-left','240px');
    // },
    // onClose: function(ec) {
    //   $('#user-page nav a.page-title').css('margin-left','0px');
    // }
  });

  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'right', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );

  $('.slider').slider({
    indicators: false
  });

  $('.carousel.carousel-slider').carousel({fullWidth: true});


  $('.get-started').click(function(){
    swal({
      text: 'Please provide your email to recieve token',
      content: "input",
      icon: '/images/icon-set/sms.png',
      button: {
        text: "Send!",
        closeModal: false,
      },
    })
      .then(name => {
        if (!name) {
          swal.stopLoading();
          swal.close();
        } else {
          swal({
            text: `Email was sent to ${name}`,
            icon: 'success',
            buttons: false
          })
        }


      })
  });
})

// swal("Deleted!", "Your imaginary file has been deleted.", "success")
