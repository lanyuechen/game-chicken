

export const show = (options) => {
  const { title, content, showCancel, onOk } = options;

  wx.showModal({
    title: title || '温馨提示',
    content,
    showCancel,
    success: (res) => {
      if (res.confirm) {
        onOk();
      }
    },
  });
}