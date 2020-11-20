/*$('.form').find('input').on('input', function (e) {
	$(e.currentTarget).attr('data-empty', !e.currentTarget.value);
});*/

const initTerminalForm = () => {
	document.querySelector('.from_control').addEventListener('input', (e) => {this.target.setAttribute('data-empty', this.currentTarget.value);})
}