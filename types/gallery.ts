export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface GalleryEvent {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  category: string;
  description: string;
  photos: GalleryPhoto[];
}

export interface GalleryPhotoView extends GalleryPhoto {
  available: boolean;
}

export interface GalleryEventView extends Omit<GalleryEvent, "photos"> {
  photos: GalleryPhotoView[];
}
