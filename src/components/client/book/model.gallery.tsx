// ModalGallery.tsx
import { Modal } from "antd";
import ImageGallery from "react-image-gallery";
import { useRef, useEffect } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import "@/styles/book.scss";
interface IPropsModal {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  currentIndex: number;
  items: any[];
}

const ModalGallery = ({
  isOpen,
  setIsOpen,
  currentIndex,
  items,
}: IPropsModal) => {
  const ref = useRef<ImageGallery>(null);

  useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.slideToIndex(currentIndex);
    }
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      width={1000}
      centered
      closable={false}
      className="modal-gallery-wrapper"
    >
      <div className="modal-gallery-content">
        <div className="modal-left">
          <ImageGallery
            ref={ref}
            items={items}
            showThumbnails={false}
            showPlayButton={false}
            showFullscreenButton={false}
          />
        </div>

        <div className="modal-right">
          <div className="thumb-title">hardcode</div>
          <div className="thumb-list">
            {items.map((item, index) => (
              <img
                key={index}
                src={item.thumbnail}
                className={index === currentIndex ? "active-thumb" : ""}
                onClick={() => ref.current?.slideToIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalGallery;
