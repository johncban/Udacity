/*
$(document.body).on('hidden.bs.modal', function () {
  $('#record').removeData('bs.modal');
});
*/

// Bootstrap burger menu mobile response 
$(document).on('click', '.navbar-collapse.in', function (e) {
  if ($(e.target).is('a')) {
    $(this).collapse('hide');
  }
});

//Edit SL: more universal
$('#record').on('hidden.bs.modal', function (e) {
  $(e.target).removeData('bs.modal');
});

$(document.body).on('hidden.bs.modal', function () {
  $('#delete').removeData('bs.modal');
});

//Edit SL: more universal
$('#delete').on('hidden.bs.modal', function (e) {
  $(e.target).removeData('bs.modal');
});

$(document.body).on('hidden.bs.modal', function () {
  $('#edit').removeData('bs.modal');
});

//Edit SL: more universal
$('#edit').on('hidden.bs.modal', function (e) {
  $(e.target).removeData('bs.modal');
});


// Easing Scroll Top. Source: https://html-online.com/articles/dynamic-scroll-back-top-page-button-javascript/
$(window).scroll(function () {
  var height = $(window).scrollTop();
  if (height > 350) {
    $('#back-top').fadeIn();
  } else {
    $('#back-top').fadeOut();
  }
});
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();

  $("#back-top").click(function (event) {
    event.preventDefault();
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
    return false;
  });
});