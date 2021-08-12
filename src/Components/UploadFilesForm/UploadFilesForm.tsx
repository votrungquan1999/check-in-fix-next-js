import { PlusOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { isNil } from 'lodash/fp';
import React, { useState, useMemo, createRef } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { getBase64, uploadFiles } from '../../services/file_storage';
import { CustomResult, CustomSpinner } from '../../styles/commons';
// import { getBase64, uploadFiles } from './enhanced';
import { getCustomUploader } from './styles';

const CustomUploader = getCustomUploader(200, 200);

interface UploadFilesFormProps {
  uploadPath: string;
}

export function UploadFilesForm(props: UploadFilesFormProps) {
  const { uploadPath } = props;
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadFile>();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccessfully, setUploadSuccessfully] = useState(false);
  const [video, setVideo] = useState<MediaStream>();
  const videoRef = createRef<HTMLVideoElement>();

  useEffect(() => {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      setVideo(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  });

  const uploadButton = useMemo(() => {
    return (
      <div>
        <PlusOutlined />
        <div className="mt-2">Upload</div>
      </div>
    );
  }, []);

  const handleUploadFiles = useCallback(async () => {
    setUploading(true);
    await uploadFiles(uploadedFiles, uploadPath);
    setUploadSuccessfully(true);
    setUploading(false);
  }, [uploadedFiles, uploadPath]);

  const submitButton = useMemo(() => {
    return (
      <Button
        type="primary"
        onClick={handleUploadFiles}
        size="large"
        className="self-end"
        disabled={!uploadedFiles.length}
        loading={uploading}
      >
        Submit
      </Button>
    );
  }, [handleUploadFiles, uploading]);

  const resetForm = useCallback(() => {
    setUploadedFiles([]);
    setPreviewFile(undefined);
    setUploading(false);
    setUploadSuccessfully(false);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewFile(undefined);
  }, []);

  const handleChangeUploadFiles = useCallback((info: UploadChangeParam<UploadFile<any>>) => {
    setUploadedFiles(info.fileList);
  }, []);

  const handlePreview = useCallback((file: UploadFile) => {
    setPreviewFile(file);
  }, []);

  if (uploadSuccessfully) {
    return (
      <div className="flex flex-col items-center">
        <CustomResult title="Upload Files Successfully" status="success" />
        <Button
          onClick={() => {
            resetForm();
          }}
          type="primary"
        >
          Upload more files
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Typography.Title level={3}>Upload Files</Typography.Title>
      <CustomUploader
        fileList={uploadedFiles}
        listType={'picture-card'}
        onChange={handleChangeUploadFiles}
        beforeUpload={() => false}
        onPreview={handlePreview}
        disabled={uploading}
      >
        {uploadButton}
      </CustomUploader>
      {submitButton}
      <PreviewModal file={previewFile} onClose={handleClosePreview} />
      <video ref={videoRef} autoPlay />
    </div>
  );
}

interface PreviewModalProps {
  file?: UploadFile;
  onClose: () => any;
}

function PreviewModal(props: PreviewModalProps) {
  const { file, onClose } = props;
  const [filePreview, setFilePreview] = useState<string>();

  const getFileData = useCallback(async (file: UploadFile) => {
    try {
      const fileData = await getBase64(file);
      if (typeof fileData !== 'string') {
        alert('load file has error type');
        return;
      }

      setFilePreview(fileData);
    } catch (error) {
      alert('load file error');
      return;
    }
  }, []);

  useEffect(() => {
    if (isNil(file)) {
      return;
    }

    getFileData(file);
  }, [file]);

  const modalContent = useMemo(() => {
    if (!filePreview) {
      return (
        <div>
          <CustomSpinner />
        </div>
      );
    }

    return <img src={filePreview} />;
  }, [filePreview]);

  return (
    <Modal footer={null} visible={!!file} onCancel={onClose} title={file?.name} width={'80%'}>
      {modalContent}
    </Modal>
  );
}
