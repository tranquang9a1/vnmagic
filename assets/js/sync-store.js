$(function(){
  $('.shopify-connect').click(function(){
    $(this).find('i.fa').removeClass('fa-refresh').addClass('fa-spin fa-spinner')
  });

  $('.remove-store').click(function(){
    let storeName = $('span.store-name').text();
    swal({
      className: 'remove-store-confirm',
      title: "Are you sure?",
      text: "Once deleted, you will not be able to manage this store!",
      icon: "warning",
      dangerMode: true,
      button: {
        text: "Remove",
        closeModal: false,
      },
    })
      .then((willDelete) => {
        if (willDelete) {
          socket.get(`/shopify/remove_store?shop=${storeName}`,function(data){
            if(data.msg == 'success'){
              location.reload()

              // swal("Your store has been deleted!", {
              //   icon: "success",
              //   button: {
              //     text: "OK",
              //     closeModal: false,
              //   },
              // }).then(result => {
              //   location.reload()
              // });
            }

          })
        } else {
          swal.stopLoading();
          swal.close();
        }
      });
  })
})
