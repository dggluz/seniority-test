import { init as initImageDrop } from './image-drop';

export const init = () => {
	initImageDrop();

	$('#new-item').submit(e => {
		e.preventDefault();
		console.log('new item');
	});
};
