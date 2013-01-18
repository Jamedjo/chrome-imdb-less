// function lookForTheNines() {
// 	$('body.title-name').addClass('lookfor');
//   var nines = $('body div:contains("9")');
//   var found = false;
//   var first_hit = true;
//   nines.each(function() {
//     var theText = $(this).text();
//     var len = $(this).text().length;

//     if (len < 200 && $(this).hasClass('star-box') != true && $(this).hasClass('rating') != true && $(this).parent().hasClass('star-box') != true) {
//       var pattern = /9/gi;
//       theText = theText.replace(pattern, '<span class="spin">9</span>');
//       $(this).wrap('<span class="spin-hover" />')
//       $(this).html(theText);
//     }
//   });
// }