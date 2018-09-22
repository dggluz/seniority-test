import { ImageDropComponent } from '../components/image-drop/image-drop.component';

export const init = () => {
	new ImageDropComponent()
		.appendTo('#drop-wrapper');

	$('#new-item').submit(e => {
		e.preventDefault();
		console.log('new item');
	});
};
