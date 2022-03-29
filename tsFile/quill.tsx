import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStore } from '@/stores';
import { PathNav, CustomButton, SelectOption, CountInput } from 'xxxxxx';
import { Form, Select, Radio, DatePicker, Modal, Input } from 'antd';
import { antFormLayout } from '@/pages/CommonFn';
import moment from 'moment';
import Quill, { RangeStatic } from 'quill';
import 'quill/dist/quill.snow.css';

let editQuill: Quill | null = null;
const Parchment = Quill.import('parchment');
Quill.register(
  'formats/size',
  new Parchment.Attributor.Style('size', 'font-size', { scope: Parchment.Scope.INLINE }),
  true
);

const AnnouncementEditForm: React.FC = observer(() => {
  const { router, announcementCreateStore, common } = useStore();
  const [form] = Form.useForm();
  const isEdit = router.location.pathname.indexOf('/AnnouncementEdit') > -1;
  const links = ['京东智能制造平台', __PLATEFORM, '系统管理', isEdit ? '编辑公告' : '新建公告'];
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isShowEndTime, setIsShowEndTime] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoPath, setVideoPath] = useState('');
  const [sectionRange, setSectionRange] = useState({} as RangeStatic);

  useEffect(() => {
    announcementCreateStore.initData();
    initQuill();
    if (isEdit) {
      const id = (router.query.announcementId as string) ?? '';
      initData(id);
    }
  }, []);
  const initQuill = () => {
    const options = {
      modules: {
        toolbar: {
          container: [
            [{ header: [false, 1, 2, 3, 4, 5, 6] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ size: ['12px', '14px', '16px', '18px', '20px', '24px', '28px'] }],
            [{ color: [] }, { background: [] }],
            [{ align: '' }, { align: 'center' }, { align: 'right' }],
            ['link'],
            ['image', 'video']
          ],
          handlers: {
            image: function () {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.click();
              input.onchange = async () => {
                if (input.files && input.files[0]) {
                  const formData = new FormData();
                  formData.append('file', input.files[0]);
                  const fileUrl = await common.uploadFile(formData);
                  const range = editQuill?.getSelection();
                  if (range) {
                    const cursorPosition = range.index;
                    editQuill?.insertEmbed(cursorPosition, 'image', fileUrl); //插入图片
                    editQuill?.setSelection(Object.assign({}, range, { index: cursorPosition + 1 })); //光标位置加1
                  }
                }
              };
            },
            video: function () {
              const range = editQuill?.getSelection();
              if (range) {
                setSectionRange(range);
              }
              setIsModalVisible(true);
            }
          }
        }
      },
      placeholder: '请编辑公告内容...',
      theme: 'snow'
    };
    editQuill = new Quill('#editor', options);
  };
  const initData = async (id: string) => {
    await announcementCreateStore.getAnnouncementDetail(parseInt(id));
    form.setFieldsValue({
      type: announcementCreateStore.announcementDetail.type,
      title: announcementCreateStore.announcementDetail.title,
      isTop: announcementCreateStore.announcementDetail.isTop,
      isNotice: announcementCreateStore.announcementDetail.isNotice,
      noticeEndTime: announcementCreateStore.announcementDetail.noticeEndTime
        ? moment(announcementCreateStore.announcementDetail.noticeEndTime)
        : undefined
    });
    editQuill && (editQuill.root.innerHTML = announcementCreateStore.announcementDetail.content);

    if (announcementCreateStore.announcementDetail.isNotice === 'Y') {
      setIsShowEndTime(true);
    }
  };

  const handleVideoPath = () => {
    if (sectionRange) {
      const cursorPosition = sectionRange.index;
      editQuill?.insertEmbed(cursorPosition, 'video', videoPath); //插入视频
      editQuill?.setSelection(Object.assign({}, sectionRange, { index: cursorPosition + 1 })); //光标位置加1
    }
    setVideoPath('');
    setIsModalVisible(false);
  };
  const handleCloseVideoModal = () => {
    setVideoPath('');
    setIsModalVisible(false);
  };

  const onNoticeChange = (e: any) => {
    if (e.target.value === 'Y') {
      setIsShowEndTime(true);
    } else {
      setIsShowEndTime(false);
    }
  };

  const getCodeTableChildren = (type: string) => {
    return SelectOption(announcementCreateStore.codeTable[type]);
  };
  const onSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        const params = Object.assign({}, values, {
          noticeEndTime: values['noticeEndTime']
            ? moment(values['noticeEndTime']).format('YYYY-MM-DD 23:59:59')
            : undefined,
          content: document?.querySelector('#editor')?.children[0].innerHTML,
          id: isEdit ? router.query.announcementId : null
        });

        if (isEdit) {
          setSubmitLoading(true);
          const res = await announcementCreateStore.updateAnnouncement(params);
          setSubmitLoading(false);
          if (res) {
            goBack();
          }
        } else {
          setSubmitLoading(true);
          const res = await announcementCreateStore.createAnnouncement(params);
          setSubmitLoading(false);
          if (res) {
            goBack();
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const goBack = () => {
    router.go(-1);
  };
  const disabledDate = (current: any) => {
    return current && current < moment().subtract(1, 'day').endOf('day');
  };

  return (
    <Wrapper>
      <PathNav links={links} />
      <div className="shop-contract">
        <div className="show-contract-title">{isEdit ? '编辑公告' : '新建公告'}</div>
        <Form
          {...antFormLayout(3, 21)}
          form={form}
          initialValues={{
            isTop: 'N',
            isNotice: 'N'
          }}>
          <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择公告类型' }]}>
            <Select placeholder="请选择" className="form-input">
              {getCodeTableChildren('NoticeType')}
            </Select>
          </Form.Item>

          <Form.Item label="公告标题" name="title" rules={[{ required: true, message: '请输入公告标题' }]}>
            <CountInput placeholder="请输入" maxLength={20} className="form-input" />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[
              {
                validator: (_, value) => {
                  if (!editQuill?.getText().replace(/\s*/g, '').length) {
                    return Promise.reject('请填写公告内容!');
                  } else {
                    return Promise.resolve();
                  }
                }
              }
            ]}>
            <EditorWrapper>
              <div id="editor"></div>
            </EditorWrapper>
          </Form.Item>

          <Form.Item label="是否置顶" name="isTop" rules={[{ required: true, message: '请选择是否置顶公告' }]}>
            <Radio.Group>
              <Radio value={'Y'}>是</Radio>
              <Radio value={'N'}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="是否公告提示" name="isNotice" rules={[{ required: true, message: '请选择是否公告提示' }]}>
            <Radio.Group onChange={onNoticeChange}>
              <Radio value={'Y'}>是</Radio>
              <Radio value={'N'}>否</Radio>
            </Radio.Group>
          </Form.Item>
          {isShowEndTime ? (
            <Form.Item
              label="公告提示有效期"
              name="noticeEndTime"
              rules={[{ required: true, message: '请选择公告提示有效期' }]}>
              <DatePicker disabledDate={disabledDate} />
            </Form.Item>
          ) : null}
        </Form>

        <br />
        <br />

        <div className="btn-line">
          <CustomButton onClick={onSubmit.bind(this)} type="primary" className="ant-btn-96" loading={submitLoading}>
            提交
          </CustomButton>

          <CustomButton onClick={goBack.bind(this)} className="ant-btn-96">
            返回
          </CustomButton>
        </div>
      </div>
      <Modal title="视频链接" visible={isModalVisible} onOk={handleVideoPath} onCancel={handleCloseVideoModal}>
        <Input
          value={videoPath}
          onChange={e => {
            console.log(e.target.value);
            setVideoPath(e.target.value);
          }}
          placeholder="请输入视频链接"></Input>
      </Modal>
    </Wrapper>
  );
});

export const Wrapper = styled.div`
  background-color: #fff;
  .shop-contract {
    padding: 15px;
    padding-top: 25px;
  }
  .show-contract-title {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
    margin: 10px 0 20px;
    font-weight: 500;
  }
  .form-wrap {
    width: 800px;
  }
  .form-btn {
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    width: 400px;
  }
  .quota-form-btn {
    margin: 10px auto 0;
    width: 800px;
    padding: 0 200px;
  }
  .form-input {
    width: 300px !important;
  }

  .btn-line {
    margin-left: 119px;
  }
  #editor {
    height: 400px;
  }
`;

export const EditorWrapper = styled.div`
  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '正文';
    font-size: 14px;
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
    content: '标题 1';
    font-size: 2em;
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
    content: '标题 2';
    font-size: 1.5em;
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
    content: '标题 3';
    font-size: 1.17em;
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
    content: '标题 4';
    font-size: 1em;
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
    content: '标题 5';
    font-size: 0.83em;
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
    content: '标题 6';
    font-size: 0.67em;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='12px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='12px']::before {
    content: '12px';
    font-size: 12px;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='14px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='14px']::before {
    content: '14px';
    font-size: 14px;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='16px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='16px']::before {
    content: '16px';
    font-size: 16px;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='18px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='18px']::before {
    content: '18px';
    font-size: 18px;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
    content: '20px';
    font-size: 20px;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='24px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='24px']::before {
    content: '24px';
    font-size: 24px;
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='28px']::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='28px']::before {
    content: '28px';
    font-size: 28px;
  }
  .ql-editor .ql-video {
    width: 600px;
    height: 338px;
    /* margin: 20px auto; */
  }
`;

export default AnnouncementEditForm;
