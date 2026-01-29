// /**
//  * Retrieves the translation of text.
//  *
//  * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
//  */
// import { __ } from '@wordpress/i18n';

// /**
//  * React hook that is used to mark the block wrapper element.
//  * It provides all the necessary props like the class name.
//  *
//  * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
//  */
// import { useBlockProps } from '@wordpress/block-editor';

// /**
//  * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
//  * Those files can contain any CSS code that gets applied to the editor.
//  *
//  * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
//  */
// import './editor.scss';

// /**
//  * The edit function describes the structure of your block in the context of the
//  * editor. This represents what the editor will render when the block is used.
//  *
//  * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
//  *
//  * @return {Element} Element to render.
//  */
// export default function Edit() {
// 	return (
// 		<p { ...useBlockProps() }>
// 			{ __(
// 				'Image Carousel Patpod – hello from the editor!',
// 				'image-carousel-patpod'
// 			) }
// 		</p>
// 	);
// }

import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';

import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';


export default function Edit({ attributes, setAttributes }) {
  const { images } = attributes;

  const normalizeAndSort = (list) => {
    return [...list]
      .sort((a, b) => a.order - b.order)
      .map((img, index) => ({
        ...img,
        order: index + 1,
      }));
  };

  const onSelectImages = (newImages) => {
    const formatted = newImages.map((img, index) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || '',
      order: index + 1,
    }));

    setAttributes({ images: formatted });
  };

  const updateAlt = (id, value) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, alt: value } : img
    );

    setAttributes({ images: updated });
  };

  const updateOrder = (id, value) => {
    const newOrder = parseInt(value, 10);
    if (isNaN(newOrder)) return;

    const updated = images.map((img) =>
      img.id === id ? { ...img, order: newOrder } : img
    );

    setAttributes({ images: normalizeAndSort(updated) });
  };

	const removeImage = (id) => {
		const filtered = images.filter((img) => img.id !== id);
		setAttributes({ images: normalizeAndSort(filtered) });
	};

	function SortableImageItem({ img, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

const onDragEnd = (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = images.findIndex((i) => i.id === active.id);
  const newIndex = images.findIndex((i) => i.id === over.id);

  const reordered = arrayMove(images, oldIndex, newIndex)
    .map((img, index) => ({
      ...img,
      order: index + 1,
    }));

  setAttributes({ images: reordered });
};



  return (
    <div className="image-carousel-editor">
      <MediaUploadCheck>
        <MediaUpload
          onSelect={onSelectImages}
          allowedTypes={['image']}
          multiple
          gallery
          value={images.map((img) => img.id)}
          render={({ open }) => (
            <Button variant="primary" onClick={open}>
              {images.length ? 'Edit images' : 'Add images'}
            </Button>
          )}
        />
      </MediaUploadCheck>

      {images.length > 0 && (
		<DndContext
  collisionDetection={closestCenter}
  onDragEnd={onDragEnd}
>
  <SortableContext
    items={images.map((img) => img.id)}
    strategy={verticalListSortingStrategy}
  >
    <div className="image-carousel-thumbs">
      {images.map((img) => (
        <SortableImageItem key={img.id} img={img}>
          <div className="image-carousel-item">
            <div className="image-carousel-thumb">
              <button
                type="button"
                className="image-carousel-remove"
                onClick={() => removeImage(img.id)}
              >
                ×
              </button>
              <img src={img.url} alt="" />
            </div>

            <TextControl
              label="Alt text"
              value={img.alt}
              onChange={(value) => updateAlt(img.id, value)}
            />

            <TextControl
              label="Order"
              type="number"
              min={1}
              max={images.length}
              value={img.order}
              onChange={(value) => updateOrder(img.id, value)}
            />
          </div>
        </SortableImageItem>
      ))}
    </div>
  </SortableContext>
</DndContext>

      )}
    </div>
  );
}
