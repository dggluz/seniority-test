import { ImageFileLoaderComponent } from '../components/image-file-loader/image-file-loader.component';

export const init = () => {
	new ImageFileLoaderComponent()
		.appendTo('#drop-wrapper');

	$('#new-item').submit(e => {
		e.preventDefault();
		console.log('new item');
	});
};
