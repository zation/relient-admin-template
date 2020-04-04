import React, { useState, useContext, useCallback } from 'react';
import { bool, array } from 'prop-types';
import { map, first } from 'lodash/fp';
import { DomainContext } from 'relient-admin/contexts';
import Lightbox from 'react-images';
import Gallery from 'react-photo-gallery';

const result = ({
  urls,
  isThumbnail,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightBoxOpen, setLightBoxOpen] = useState(false);
  const openLightBox = useCallback((_, { index }) => {
    setCurrentImageIndex(index);
    setLightBoxOpen(true);
  }, []);
  const closeLightBox = useCallback(() => setLightBoxOpen(false), []);
  const onPrev = useCallback(
    () => setCurrentImageIndex(currentImageIndex - 1),
    [currentImageIndex],
  );
  const onNext = useCallback(
    () => setCurrentImageIndex(currentImageIndex + 1),
    [currentImageIndex],
  );
  const { cdnDomain } = useContext(DomainContext);

  const imageSet = map((url) => ({
    src: `${cdnDomain}${url}`,
    width: 1,
    height: 1,
  }))(urls);
  const galleryImageSet = isThumbnail ? [first(imageSet)] : imageSet;

  return (
    <>
      <Gallery
        photos={galleryImageSet}
        onClick={openLightBox}
      />
      <Lightbox
        currentImage={currentImageIndex}
        isOpen={lightBoxOpen}
        onClose={closeLightBox}
        images={imageSet}
        onClickNext={onNext}
        onClickPrev={onPrev}
      />
    </>
  );
};

result.propTypes = {
  urls: array,
  isThumbnail: bool,
};

result.displayName = __filename;

export default result;
