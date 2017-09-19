export default {
  namespace: 'asDropdown',
  skin: null,
  panel: '+', //jquery selector to find content in the page, or '+' means adjacent siblings
  clickoutHide: true, //When clicking outside of the dropdown, trigger hide event
  imitateSelect: false, //let select value show in trigger bar
  select: null, //set initial select value, when imitateSelect is set to true
  data: 'value',

  //callback comes with corresponding event
  onInit: null,
  onShow: null,
  onHide: null,
  onChange: null
};
