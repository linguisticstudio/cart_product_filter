(function ($) {
	Drupal.behaviors.cart_product_filter = {
		attach: function() {
		  
			//Form submit of bulk variation form
			$('.bulk-apply').click(function() {		  
				var tmp = '';
				$("input:checkbox[name=pid]:checked").each(function(){
					tmp +=  $(this).val() + ',';			
				});
				if (tmp == '') {
					alert('Please select atleast one product');
					$("#backgroundPopup").fadeOut("slow");
					return false;
				}
				
				if ( !$('.radio-percentage').is(':checked') && !$('.radio-fixed').is(':checked')) {
					alert('Please check any bulk variation type');
					$("#backgroundPopup").fadeOut("slow");
					return false;
				}		  
			  
				//  check the existence of % in percentage values if not trigger error
				var frmArr = $("#cart-product-filter-bulk-form").serializeArray();
				
				var list_per = frmArr[8].value.match(/\%/);
				if (!list_per && (frmArr[8].value != 0)) {
					alert('Enter % in list price');
					return false;
				}
				
				var cost = frmArr[9].value.match(/\%/);
				if (!cost && (frmArr[9].value != 0)) {
					alert('Enter % in cost');
					return false;
				}
				
				var sell_per = frmArr[10].value.match(/\%/);
				if (!sell_per && (frmArr[10].value != 0)) {
					alert('Enter % in sell price');
					return false;
				}
				
				var b2b_sell_per = frmArr[11].value.match(/\%/);
				if (!b2b_sell_per && (frmArr[11].value != 0)) {
					alert('Enter % in b2b sell price');
					return false;
				}
				// end of percentage checking
					  
				// check no % in fixed price
				var list_per = frmArr[4].value.match(/\%/);
				if (list_per && (frmArr[4].value != 0)) {
					alert('Dont enter % in list price');
					return false;
				}

				var cost = frmArr[5].value.match(/\%/);
				if (cost && (frmArr[5].value != 0)) {
					alert('Dont enter % in cost');
					return false;
				}

				var sell_per = frmArr[6].value.match(/\%/);
				if (sell_per && (frmArr[6].value != 0)) {
					alert('Dont enter % in sell price');
					return false;
				}

				var b2b_sell_per = frmArr[7].value.match(/\%/);
				if (b2b_sell_per && (frmArr[7].value != 0)) {
					alert('Dont enter % in b2b sell price');
					return false;
				}
			  
				var x;
				var r=confirm("Do you want to change the values on selected rows, Please confirm!");
				if (r == true){
					div = $("<div>").attr('id','backgroundPopup');
					$("body").prepend(div);
					$("#backgroundPopup").css({
						"opacity": "0.7"
					});
					$("#backgroundPopup").fadeIn("slow");
					div = $("<div>").html("Applying your change....").attr('id','loading');
					$("body").prepend(div);
					var nids = '&nids=' + tmp;
					var queryArr = $("#cart-product-filter-bulk-form").serialize();		  
					queryArr += nids;
					var values = queryArr;
					var base_url = Drupal.settings.basePath; 
					$.ajax({
						url: base_url + "ajaxsubmit",
						type: "get",
						data: values,
						success: function( strData ){
							window.location.reload();
						},
						error:function(){
							alert("Something gone wrong, Please try again!.");
							window.location.reload();
						}
					});
				} else {
					return false;
				}
				return false;
			});
		  
		  
			//Implement toggle on selectall checkbox
			$('.selectall').change(function() {
				//alert($('.selectall').val());
				if ($('.selectall').is(':checked')) {
					$("input:checkbox[name=pid]").each(function(){
						$(this).attr('checked','checked');
					});
				}else{
					$("input:checkbox[name=pid]").each(function(){
						$(this).removeAttr('checked');
					});
				}
				return false;
			});
		  
			//Implement toggle on bulk variation radios
			$('.radio-percentage').change(function() {		  
				$('.radio-fixed').removeAttr('checked');
				return false;
			});
			
			$('.radio-fixed').change(function() {			  
				$('.radio-percentage').removeAttr('checked');
				return false;
			});

			$('.funkyrow').click(function() {
				$(".col-edit").removeClass("editable");
				$(".col-edit").attr('contentEditable', false);		 
				$(".col-edit", this.parentNode).attr('contentEditable',true);
				$(".col-edit", this.parentNode).addClass("editable");
				$(this.parentNode.parentNode).addClass("editing");	
			});

			/*
			$("body").delegate("*", "click", function(e) {
				if($('.editing').length) {
					var childofediting = false;
					var $parents = $(this).parents();
					$parents.each(function(){
						if($(this) == $('.editing')) {
							childofediting = true;
						}
					});
					if(!childofediting) {
						alert(this.id);
					}
					$('.editing').removeClass("editing");
					e.stopPropagation();
				}
				// alert(this.parentNode.parentNode.id);
			});
			*/

			$("body").delegate(".col-edit", "blur", function() {
				$(".col-edit").removeClass("editable");
				$(".col-edit").attr('contentEditable', false);
				var nid_text =  this.parentNode.id;
				var nid = nid_text.split("_");
				$(".spinner_" + nid[1]).addClass("autocomp");
				var val = $(this).text();
				var queryparam = '';
				queryparam = 'nid=' + nid[1] + '&' + nid[0] + '_price=' + val;
				var values = queryparam;
				var base_url = Drupal.settings.basePath;
				
				$.ajax({
					url: base_url + "contextajaxsubmit",
					type: "get",
					data: values,
					success: function( strData ){
						$(".spinner_" + nid[1]).removeClass("autocomp");		    	  
					},
					error:function(){
						alert("Something gone wrong, Please try again!");
					}   
				}); 		 
			});	
		}
	};
})(jQuery);