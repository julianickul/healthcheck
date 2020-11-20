
const initTogglePageView = () => {
	document.querySelector('#nav_toggler').onclick = function (e) {
		const wrapper = document.querySelector('.wrapper');
		wrapper.classList.toggle('page_view-compact');
		e.preventDefault();
	}
}

const initUserAccessSelect = () => {
	const contentParent = document.querySelector('.content');
	const summary = document.querySelector('.queue__checkup-summary__result')
	const userAccessParams = [
		{ elementClass: 'content_view-user-approved', parentClass: 'scan-result_approved', message: 'Сотрудник допущен к работе (направлен на смену)'},
		{ elementClass: 'content_view-user-notapproved', parentClass: 'scan-result_refused', message: 'Сотрудник не допущен к работе и направлен в медицинское учреждение для дальнейшей диагностики и лечения'}
	]
	document.querySelector('#userAccess').onchange = function(e) {
		contentParent.className = 'content ' + userAccessParams[this.value].elementClass;
		this.parentElement.className = 'scan-result__item ' + userAccessParams[this.value].parentClass;
		summary.textContent = userAccessParams[this.value].message;
		e.preventDefault();
	}
}

const initUserCardEditButton = () => {
	const form_inputs = document.querySelectorAll('.form input[type=text]');
	const form_select = document.querySelectorAll('.form .custom-select');
	const form_button = document.querySelector('#usercard_save_button');
	form_inputs.forEach(item => {
		item.addEventListener('keyup', event => {
			form_button.disabled = false;
			form_button.nextElementSibling.style.display = 'none';
		})
	})
	form_select.forEach(item => {
		item.addEventListener('change', event => {
			form_button.disabled = false;
			form_button.nextElementSibling.style.display = 'none';
		})
	})
}

const initScanResultsEdit = () => {
	$('.scan-result__view .scan-result__ico').on('click', function() {
		let editBlock = $(this).parent().siblings('.scan-result__edit');
		editBlock
			.toggleClass('isHidden')
			.find('.form-control').focus();
		$(this).parent().toggleClass('isHidden');
	})
	$('.scan-result__edit .scan-result__ico').on('click', function() {
		let parent = $(this).parent();
		parent.siblings('.scan-result__view').toggleClass('isHidden')
		parent.toggleClass('isHidden');
	})
}

/* ----------------------------------- TABLES -------------------------------------------- */

/*
 * props: {
 *	 table_id : String,
 *	 excludeFirst : Boolean,
 *	 excludeLast : Boolean
 }
 */
const initSearchTable = (props) => {
	let excludesArr = [];
	if (props.excludeFirst !== undefined && props.excludeFirst) {
		excludesArr.push(0);
	}
	if (props.excludeLast !== undefined && props.excludeLast) {
		excludesArr.push($('#' + props.table_id + ' thead tr th').length-1);
	}
	$('#' + props.table_id + ' thead tr').clone(true).appendTo( '#' + props.table_id + ' thead' );
	$('#' + props.table_id + ' thead tr:eq(1) th').each( function (i) {
		if (!excludesArr.includes(i)) 
			$(this).html( '<input type="text" class="form-control" />' );

		$( 'input', this ).on( 'keyup change', function () {
			if ( table.column(i).search() !== this.value ) {
				table
					.column(i)
					.search( this.value )
					.draw();
			}
		} );
	});

	const table = $('#' + props.table_id).DataTable({
		language: {
			"url": "../assets/js/vendors/dataTables_Ru.json"
		},
		orderCellsTop: true,
		fixedHeader: true,
		autoWidth: false,
		paging: false,
		columnDefs: [
			{
				orderable: false,
				searchable:false,
				targets: excludesArr
			}
		]
	});
}

const initTable = (props) => {
	let excludesArr = [];
	if (props.excludeFirst !== undefined && props.excludeFirst) {
		excludesArr.push(0);
	}
	if (props.excludeLast !== undefined && props.excludeLast) {
		excludesArr.push($('#' + props.table_id + ' thead tr th').length-1);
	}

	$('#' + props.table_id).DataTable({
		language: {
			"url": "../assets/js/vendors/dataTables_Ru.json"
		},
		orderCellsTop: true,
		fixedHeader: true,
		autoWidth: false,
		paging: false,
		columnDefs: [
			{
				orderable: false,
				targets: excludesArr
			}
		]
	});
}


function initArchiveTable() {
	const lastCell = $('#archive_table thead tr:eq(0) th').length-1;
	const table = $('#archive_table').DataTable({
		language: {
			url: '../assets/js/vendors/dataTables_Ru.json'
		},
		orderCellsTop: true,
		fixedHeader: true,
		autoWidth: false,
		paging: false,
		columnDefs: [
			{
				orderable: false,
				searchable:false,
				targets:[0,lastCell]
			}
		],
		order: [[1, 'asc']],
	});

	//init search for archieve table
	$.each($('#archive_table thead input[type="text"]'), function(i) {
		$(this).on( 'keyup change', function () {
			const column_index = i+1; // first column is checkbox, so increase column index by 1
			if ( table.column(column_index).search() !== this.value ) {
				table
					.column(column_index)
					.search( this.value )
					.draw();
			}
		})
	});


	// Handle click on "Select all" control
	$('#all_chbk').on('click', function(){
		// Get all rows with search applied
		var rows = table.rows({ 'search': 'applied' }).nodes();
		// Check/uncheck checkboxes for all rows in the table
		$('input[type="checkbox"]', rows).prop('checked', this.checked);
		if (this.checked) {
			table.rows().select().draw( false );
		} else {
			table.rows().deselect().draw( false );
		}
	});

	// Handle click on checkbox to set state of "Select all" control
	$('#archive_table tbody').on('change', 'input[type="checkbox"]', function(){
		var parentRow = $(this).closest("tr")[0];

		// If checkbox is not checked
		if(!this.checked){
			var el = $('#all_chbk').get(0);
			// If "Select all" control is checked and has 'indeterminate' property
			if(el && el.checked && ('indeterminate' in el)){
				// Set visual state of "Select all" control
				// as 'indeterminate'
				el.indeterminate = true;
			}
			$(parentRow).removeClass('selected')
		} else {
			$(parentRow).addClass('selected')
		}
	});
}



/* DATEPICKERS */

const initSimpleDatepicker = (input) => {
	input.dateRangePicker({
		format: 'DD.MM.YYYY',
		language: 'ru',
		startOfWeek: 'monday',
		showTopbar: false,
		showShortcuts: false,
		hoveringTooltip: false,
		autoClose: true,
		singleDate : true,
		showShortcuts: false,
		singleMonth: true,
		beforeShowDay: function(t){
			var valid = !(t.getDay() == 0 || t.getDay() == 6);  //highlight saturday and sunday
			var _class = valid ? '' : 'weekend';
			return [true,_class,''];
		},
		customOpenAnimation: function(cb) {
			$(this).fadeIn(50, cb);
		},
		customCloseAnimation: function(cb) {
			$(this).fadeOut(50, cb);
		}
	})
	input.siblings('.form-control__icon').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		input.click();
		input.focus();
	})
}
