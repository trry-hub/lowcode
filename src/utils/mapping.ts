export const mapInfo = () => {
  const { MODE } = import.meta.env
  return {
    doctorUrl: MODE === 'development' ? 'https://kshdoctor-dev.yaomaitong.net' : MODE === 'test' ? 'https://kshdoctor.yaomaitong-pre.cn' : MODE === 'production' ? 'https://kshdoctor.yaomaitong.cn' : ''
  }
}
