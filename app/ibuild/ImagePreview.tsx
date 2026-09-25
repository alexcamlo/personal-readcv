"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./page.module.css";

type ImagePreviewProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
};

export default function ImagePreview(props: ImagePreviewProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState(false);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={styles.imagePreview}
        aria-label={`Enlarge image: ${props.alt}`}
        aria-haspopup="dialog"
        onClick={() => {
          setOpened(true);
          dialog.current?.showModal();
        }}
      >
        <Image {...props} />
      </button>
      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label={`Image preview: ${props.alt}`}
        onClose={() => {
          setOpened(false);
          trigger.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className={styles.lightboxToolbar}>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            autoFocus
          >
            Close
          </button>
        </div>
        {opened && (
          // Keep the full-resolution original out of the initial page load.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={props.src}
            alt={props.alt}
            width={props.width}
            height={props.height}
          />
        )}
      </dialog>
    </>
  );
}
