import { Button, Typography } from 'antd';
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getFiles } from '../../../services/file_storage';
import { Ticket } from '../../../services/tickets';
import { CustomSpinner } from '../../../styles/commons';
import firebase from 'firebase';
import QRCode from 'react-qr-code';

interface UploadFileStageProps {
  ticket: Ticket;
}

export function TicketUploadFilesView(props: UploadFileStageProps) {
  const { ticket } = props;
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [images, setImages] = useState<firebase.storage.ListResult>();

  const getImages = useCallback(async () => {
    const images = await getFiles(`/tickets/${ticket.id}`);
    if (!images) {
      return;
    }

    setImages(images);
  }, [ticket]);

  const checkImageUploaded = useCallback(async () => {
    setTimeout(checkImageUploaded, 10000);
    getImages();
  }, [getImages]);

  const fileList = useMemo(() => {
    if (!images?.items.length) {
      return;
    }

    const imagesList = images.items.map((image) => {
      return <div>{image.name}</div>;
    });

    return (
      <div>
        <Typography.Title level={5}>List Files:</Typography.Title>
        {imagesList}
      </div>
    );
  }, [images]);

  useEffect(() => {
    checkImageUploaded();
  }, [checkImageUploaded]);

  if (isNil(images)) {
    return (
      <div>
        <CustomSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Typography.Title level={3}>
        Please Scan this QR code to upload any images related to this ticket
      </Typography.Title>
      <div className="self-center">
        <QRCode value={`${baseURL}/tickets/${ticket.id}/upload`} />
      </div>
      <Typography.Title level={5}>You have uploaded: {images.items.length} files.</Typography.Title>
      {fileList}
      <Button onClick={() => getImages()} type="primary" className="mt-5">
        Reload
      </Button>
    </div>
  );
}
