import React, { useState } from 'react';

export const Certifications = ({ onBack }) => {
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Provider SVG Logos Dictionary
  const providerLogos = {
    google: `<svg class="provider-logo-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.511 9.722a7.833 7.833 0 0 0-2.359-3.804l-.035.035.005-.042A7.81 7.81 0 0 0 4.418 9.722c.031-.013.066-.013.099-.023a5.643 5.643 0 0 0-.306 9.166l.006-.006-.006.024a5.612 5.612 0 0 0 3.407 1.134h4.321l.024.024h4.341a5.644 5.644 0 0 0 3.207-10.319zm-3.206 6.845h-4.341l-.006.006v-.031h-4.34c-.308 0-.611-.066-.892-.193l.002-.001a2.17 2.17 0 1 1 2.87-2.871l2.518-2.518a5.634 5.634 0 0 0-3.396-2.1c.018-.009.035-.024.05-.021a4.334 4.334 0 0 1 5.931-.451h.046a4.334 4.334 0 0 1 1.558 3.407v.433a2.17 2.17 0 1 1 0 4.34z"></path></svg>`,
    hackerrank: `<svg class="provider-logo-svg" viewBox="0 0 32 32" fill="currentColor"><path d="M 15.998047 3 C 14.225047 3 5.5352031 7.9839062 4.6582031 9.5039062 C 3.7802031 11.024906 3.7802031 20.983047 4.6582031 22.498047 C 5.5392031 24.017047 14.229047 29 15.998047 29 C 17.762047 29 26.451938 24.019953 27.335938 22.501953 C 28.222938 20.979953 28.222938 11.014047 27.335938 9.4980469 L 27.335938 9.4960938 C 26.444937 7.9790937 17.756047 3 15.998047 3 z M 15.996094 5.0117188 C 17.693094 5.3647187 24.417703 9.2167656 25.595703 10.509766 C 26.135703 12.150766 26.134703 19.844281 25.595703 21.488281 C 24.425703 22.779281 17.695094 26.636281 15.996094 26.988281 C 14.298094 26.638281 7.5723906 22.783234 6.4003906 21.490234 C 5.8653906 19.842234 5.8653906 12.155766 6.4003906 10.509766 C 7.5693906 9.2167656 14.297094 5.3617187 15.996094 5.0117188 z M 13 9 L 11 11 L 12 11 L 12 21 L 14 21 L 14 17 L 18 17 L 18 21 L 17 21 L 19 23 L 21 21 L 20 21 L 20 12 L 18 12 L 18 15 L 14 15 L 14 11 L 15 11 L 13 9 z"></path></svg>`,
    anthropic: `<svg class="provider-logo-svg" viewBox="0 0 92.2 65" fill="currentColor"><path d="M66.5,0H52.4l25.7,65h14.1L66.5,0z M25.7,0L0,65h14.4l5.3-13.6h26.9L51.8,65h14.4L40.5,0C40.5,0,25.7,0,25.7,0z M24.3,39.3l8.8-22.8l8.8,22.8H24.3z"/></svg>`,
    cisco: `<svg class="provider-logo-svg" viewBox="0 0 32 32" fill="currentColor"><path d="M1.004 14.41c0.026 0.338 0.307 0.602 0.649 0.602s0.623-0.264 0.649-0.6l0-0.002v-1.443c-0.016-0.346-0.3-0.621-0.649-0.621s-0.633 0.275-0.649 0.62l-0 0.001v1.443zM4.598 14.41c0.030 0.335 0.31 0.595 0.65 0.595s0.62-0.26 0.65-0.593l0-0.003v-3.235c-0.016-0.346-0.3-0.621-0.649-0.621s-0.633 0.275-0.649 0.62l-0 0.001v3.235zM8.174 15.714c0.016 0.346 0.3 0.621 0.649 0.621s0.633-0.275 0.649-0.62l0-0.001v-6.999c-0.016-0.346-0.3-0.621-0.649-0.621s-0.633 0.275-0.649 0.62l-0 0.001v6.999zM11.781 14.41c0.016 0.346 0.3 0.621 0.649 0.621s0.633-0.275 0.649-0.62l0-0.001v-3.235c-0.016-0.346-0.3-0.621-0.649-0.621s-0.633 0.275-0.649 0.62l-0 0.001v3.235zM15.368 14.41c0.034 0.332 0.311 0.588 0.649 0.588s0.616-0.257 0.649-0.586l0-0.003v-1.443c-0.016-0.346-0.3-0.621-0.649-0.621s-0.633 0.275-0.649 0.62l-0 0.001v1.443zM18.99 14.41c0.022 0.342 0.304 0.611 0.65 0.611s0.628-0.269 0.65-0.609l0-0.002v-3.235c-0.016-0.346-0.3-0.621-0.649-0.621s-0.633 0.275-0.649 0.62l-0 0.001v3.235zM22.537 15.714c0.026 0.338 0.307 0.602 0.649 0.602s0.623-0.264 0.649-0.6l0-0.002v-6.999c-0.016-0.346-0.3-0.621-0.649-0.621s-0.633 0.275-0.649 0.62l-0 0.001v6.999zM26.143 14.41c0.027 0.338 0.308 0.603 0.65 0.603s0.624-0.264 0.65-0.601l0-0.002v-3.235c-0.022-0.342-0.304-0.611-0.65-0.611s-0.628 0.269-0.65 0.609l-0 0.002v3.235zM29.697 14.41c0.016 0.346 0.3 0.621 0.649 0.621s0.633-0.275 0.649-0.62l0-0.001v-1.443c-0.016-0.346-0.3-0.621-0.649-0.621s-0.633 0.275-0.649 0.62l-0 0.001v1.443z"/></svg>`,
    oracle: `<svg class="provider-logo-svg" viewBox="0 0 93.9 59.4" fill="currentColor"><path d="M30.5,59.4H65c16.4-0.4,29.3-14.1,28.9-30.4C93.5,13.1,80.7,0.4,65,0H30.5C14.1-0.4,0.4,12.5,0,28.9s12.5,30,28.9,30.4C29.4,59.4,29.9,59.4,30.5,59.4 M64.2,48.9h-33c-10.6-0.3-18.9-9.2-18.6-19.8C13,19,21.1,10.8,31.2,10.5h33c10.6-0.3,19.5,8,19.8,18.6c0.3,10.6-8,19.5-18.6,19.8C65,48.9,64.6,48.9,64.2,48.9"/></svg>`,
    ibm: `<svg class="provider-logo-svg" viewBox="0 0 32 32" fill="currentColor"><path d="M1.004 21.583h5.438v-0.78h-5.438zM1.004 20.094h5.438v-0.779h-5.438zM2.558 18.605h2.331v-0.78h-2.331zM2.558 17.116h2.331v-0.779h-2.331zM2.558 15.629h2.331v-0.78h-2.331zM2.558 14.141h2.331v-0.78h-2.331zM1.004 12.652h5.438v-0.78h-5.438zM1.004 11.164h5.438v-0.78h-5.438zM7.218 20.095h8.29c0.131-0.224 0.239-0.484 0.308-0.759l0.004-0.021h-8.601zM14.858 16.339h-6.086v0.78h6.734c-0.176-0.303-0.392-0.56-0.645-0.776l-0.004-0.003zM8.772 14.85v0.78h6.086c0.256-0.22 0.472-0.477 0.641-0.766l0.008-0.014zM15.508 11.874h-8.289v0.78h8.603c-0.073-0.295-0.181-0.555-0.32-0.794l0.008 0.014zM12.938 10.385h-5.72v0.78h7.723c-0.524-0.483-1.226-0.78-1.998-0.78-0.001 0-0.003 0-0.004 0h0zM8.773 14.141h2.331v-0.78h-2.331zM13.293 14.141h2.509c0.065-0.234 0.103-0.502 0.104-0.779v-0h-2.613zM8.773 18.605h2.331v-0.78h-2.331zM13.292 17.826v0.78h2.614c-0.001-0.278-0.038-0.546-0.109-0.801l0.005 0.021zM7.219 21.575l5.721 0.008c0.002 0 0.004 0 0.007 0 0.771 0 1.473-0.296 1.997-0.782l-0.002 0.002h-7.723zM22.756 21.582l0.271-0.78h-0.54zM22.238 20.093h1.037l0.272-0.779h-1.582zM21.718 18.604h2.077l0.272-0.779h-2.622zM21.197 17.117h3.119l0.272-0.78h-3.664zM18.096 14.139h4.198l-0.27-0.779h-3.928zM23.737 12.652h5.236v-0.78h-4.966zM24.523 10.384l-0.27 0.78h4.719v-0.78zM16.542 21.582h3.884v-0.78h-3.884zM16.542 20.093h3.884v-0.779h-3.884zM18.096 18.604h2.331v-0.778h-2.331zM18.096 17.117h2.331v-0.78h-2.331zM27.418 13.361h-3.926l-0.271 0.78h4.198zM25.089 15.629h2.329v-0.78h-4.442l-0.219 0.63-0.219-0.63h-4.442v0.78h2.331v-0.717l0.25 0.717h4.161l0.25-0.717zM25.089 17.117h2.329v-0.78h-2.331zM25.089 18.605h2.329v-0.78h-2.331zM25.089 20.092h3.883v-0.778h-3.884zM25.089 21.582h3.883v-0.78h-3.884zM21.777 12.651l-0.27-0.779h-4.965v0.78zM21.261 11.164l-0.27-0.78h-4.449v0.78z"/></svg>`,
    intel: `<svg class="provider-logo-svg" viewBox="0 0 32 32" fill="currentColor"><path d="M30.238 20.203c-0.418 0-0.757 0.339-0.757 0.757s0.339 0.757 0.757 0.757c0.418 0 0.757-0.339 0.757-0.757 0-0.209-0.085-0.398-0.222-0.535v0c-0.137-0.137-0.326-0.222-0.535-0.222v0zM30.673 21.402c-0.113 0.113-0.269 0.183-0.442 0.183-0.345 0-0.625-0.28-0.625-0.625s0.278-0.623 0.622-0.625l0-0.001h0.003c0.345 0.001 0.625 0.28 0.625 0.626 0 0.173-0.070 0.329-0.183 0.442v0zM30.525 20.96c0.039-0.041 0.063-0.097 0.063-0.158 0-0.004-0-0.008-0-0.012l0 0.001c0-0.005 0.001-0.011 0.001-0.016 0-0.070-0.031-0.133-0.079-0.176l-0-0c-0.055-0.044-0.126-0.071-0.203-0.071-0.010 0-0.019 0-0.029 0.001l0.001-0h-0.34v0.873h0.162v-0.356h0.116l0.216 0.356h0.17l-0.225-0.371c0.058-0.006 0.109-0.031 0.147-0.070l0-0zM30.292 20.899h-0.192v-0.247h0.192c0.026 0.001 0.049 0.007 0.072 0.016l-0.002-0.001c0.020 0.007 0.036 0.020 0.046 0.038l0 0c0.016 0.016 0.015 0.039 0.015 0.070 0 0.001 0 0.002 0 0.002 0 0.024-0.006 0.047-0.015 0.067l0-0.001c-0.013 0.015-0.029 0.028-0.045 0.038l-0.001 0c-0.021 0.008-0.044 0.014-0.069 0.016l-0.001 0zM1.004 10.345h2.171v2.171h-2.171v-2.171zM8.846 13.673v0.001c-0.013-0-0.028-0-0.043-0-0.476 0-0.927 0.111-1.327 0.309l0.017-0.008c-0.411 0.203-0.754 0.485-1.022 0.828l-0.005 0.006-0.109 0.146v-1.127h-2.032v7.818h2.048v-4.016c-0.002-0.036-0.003-0.077-0.003-0.119 0-0.574 0.206-1.099 0.547-1.507l-0.003 0.004c0.323-0.343 0.78-0.556 1.286-0.556 0.006 0 0.013 0 0.019 0h-0.001c0.033-0.002 0.072-0.004 0.111-0.004 0.49 0 0.932 0.209 1.24 0.543l0.001 0.001c0.283 0.377 0.452 0.853 0.452 1.369 0 0.046-0.001 0.092-0.004 0.137l0-0.006v4.154h2.078v-4.434c0.005-0.071 0.008-0.154 0.008-0.238 0-0.907-0.327-1.737-0.869-2.38l0.005 0.005c-0.564-0.576-1.35-0.932-2.219-0.932-0.062 0-0.124 0.002-0.185 0.005l0.008-0zM26.522 10.183h2.063v11.472h-2.063v-11.472zM24.336 14.857c-0.352-0.364-0.777-0.657-1.25-0.855l-0.025-0.009c-0.467-0.196-1.011-0.31-1.581-0.31-0.020 0-0.041 0-0.061 0l0.003-0c-0.009-0-0.020-0-0.032-0-1.663 0-3.091 1.008-3.705 2.447l-0.010 0.026c-0.201 0.456-0.318 0.989-0.318 1.548 0 0.015 0 0.030 0 0.045l-0-0.002c-0 0.009-0 0.020-0 0.031 0 0.562 0.111 1.099 0.311 1.589l-0.010-0.028c0.205 0.501 0.49 0.929 0.843 1.29l-0.001-0.001c0.362 0.365 0.797 0.658 1.28 0.857l0.026 0.009c0.483 0.206 1.045 0.325 1.635 0.325 0.015 0 0.030-0 0.045-0l-0.002 0c0.035 0.001 0.077 0.002 0.119 0.002 1.339 0 2.54-0.594 3.353-1.533l0.005-0.006-1.483-1.13c-0.493 0.535-1.196 0.869-1.978 0.873h-0.001c-0.033 0.002-0.071 0.003-0.11 0.003-0.49 0-0.945-0.151-1.32-0.409l0.008 0.005c-0.357-0.265-0.62-0.641-0.738-1.076l-0.003-0.014-0.024-0.070h6.142v-0.733c0-0.007 0-0.015 0-0.023 0-0.561-0.108-1.098-0.304-1.589l0.010 0.029c-0.206-0.499-0.485-0.927-0.828-1.293l0.002 0.002zM19.33 17.012c0.159-0.906 0.94-1.585 1.879-1.585 0.067 0 0.133 0.003 0.198 0.010l-0.008-0.001c0.060-0.007 0.13-0.011 0.2-0.011 0.937 0 1.717 0.676 1.877 1.567l0.002 0.012zM15.289 10.785h-2.063v7.564c-0.001 0.038-0.001 0.083-0.001 0.128 0 0.527 0.060 1.040 0.172 1.533l-0.009-0.046c0.095 0.404 0.287 0.754 0.551 1.036l-0.001-0.001c0.27 0.266 0.609 0.463 0.988 0.56l0.015 0.003c0.427 0.109 0.918 0.172 1.424 0.172 0.051 0 0.102-0.001 0.152-0.002l-0.008 0h0.27v-1.916c-0.023 0-0.050 0.001-0.076 0.001-0.234 0-0.465-0.017-0.69-0.050l0.026 0.003c-0.189-0.018-0.358-0.097-0.488-0.217l0.001 0.001c-0.114-0.126-0.192-0.288-0.216-0.467l-0-0.004c-0.030-0.205-0.047-0.442-0.047-0.683 0-0.026 0-0.052 0.001-0.078l-0 0.004v-2.727h1.491v-1.77h-1.491zM1.058 13.829h2.063v7.818h-2.063v-7.818z"/></svg>`,
    hp: `<svg class="provider-logo-svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M8.4210347,0.00016035599 L5,15.127022 L7.13818677,15.127022 L10.5590611,0.00016035599 L8.4210347,0.00016035599 Z M17.4142797,8.87313837 L15.9176772,15.0979976 L18.0557037,15.0979976 L19.5523061,8.87313837 L17.4142797,8.87313837 Z M13.7794905,8.87313837 L10.3586161,24 L12.4966425,24 L15.9176772,8.87313837 L13.7794905,8.87313837 Z M10.131552,8.87313837 L8.63478923,15.0979976 L10.7728157,15.0979976 L12.2694181,8.87313837 L10.131552,8.87313837 Z"/></svg>`,
    academic: `<svg class="provider-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    hackathon: `<svg class="provider-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    goldMedal: `<svg class="provider-logo-svg prize-medal-svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="13" r="9.5" stroke-width="2.2"/><circle cx="16" cy="13" r="7" stroke-width="1.6"/><path d="M14.5 11 L16.3 9.5 V16.5 M14.5 16.5 H17.8" stroke-width="2"/><path d="M10.2 20.5 L6.5 29 L11.5 26.5 L13.8 29.5 L14.5 20.8" stroke-width="1.8"/><path d="M21.8 20.5 L25.5 29 L20.5 26.5 L18.2 29.5 L17.5 20.8" stroke-width="1.8"/></svg>`,
    silverMedal: `<svg class="provider-logo-svg prize-medal-svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="13" r="9.5" stroke-width="2.2"/><circle cx="16" cy="13" r="7" stroke-width="1.6"/><path d="M13.8 11 C13.8 9.5 17.8 9.5 17.8 12.2 C17.8 14.2 13.8 14.8 13.8 16.5 H18" stroke-width="2"/><path d="M10.2 20.5 L6.5 29 L11.5 26.5 L13.8 29.5 L14.5 20.8" stroke-width="1.8"/><path d="M21.8 20.5 L25.5 29 L20.5 26.5 L18.2 29.5 L17.5 20.8" stroke-width="1.8"/></svg>`,
    bronzeMedal: `<svg class="provider-logo-svg prize-medal-svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="13" r="9.5" stroke-width="2.2"/><circle cx="16" cy="13" r="7" stroke-width="1.6"/><path d="M13.8 10 H17.8 L15.5 12.8 C17.2 12.8 17.8 16.5 13.8 16.5" stroke-width="2"/><path d="M10.2 20.5 L6.5 29 L11.5 26.5 L13.8 29.5 L14.5 20.8" stroke-width="1.8"/><path d="M21.8 20.5 L25.5 29 L20.5 26.5 L18.2 29.5 L17.5 20.8" stroke-width="1.8"/></svg>`,
    nta: `<svg class="provider-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    codealpha: `<svg class="provider-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    tcs: `<svg class="provider-logo-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>`,
    calicut: `<svg class="provider-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    sololearn: `<svg class="provider-logo-svg" viewBox="0 0 48 48" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M20.7143,30.3722c0-3.2261-6.3709-3.6715-6.3709-11.7725S18.8446,9.6954,18.8446,6.55,6.38,7.23,6.38,19.2922,20.7143,33.5983,20.7143,30.3722Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M30.3042,27.2168c-3.2261,0-3.6715,6.371-11.7724,6.371S9.6274,29.0865,6.4823,29.0865s.68,12.465,12.742,12.465S33.53,27.2168,30.3042,27.2168Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M17.6958,20.8178c3.2261,0,3.6714-6.371,11.7724-6.371s8.9044,4.5013,12.0495,4.5013-.68-12.465-12.742-12.465S14.47,20.8178,17.6958,20.8178Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M27.2864,17.6278c0,3.2261,6.371,3.6715,6.371,11.7725s-4.5012,8.9043-4.5012,12.05,12.465-.68,12.465-12.742S27.2864,14.4017,27.2864,17.6278Z"/></svg>`
  };

  // Complete List of All Accredited Certifications & Milestones from certifications.html
  const certsData = [
    {
      year: '2026',
      months: [
        {
          name: 'September 2026',
          items: [
            {
              issuer: 'Google Cloud Skills Boost',
              date: 'Sep 2026',
              title: 'Introduction to Generative AI',
              tags: ['Generative AI', 'LLMs', 'Google Cloud'],
              logoKey: 'google'
            },
            {
              issuer: 'HackerRank',
              date: 'Sep 2026',
              title: 'HackerRank Orchestrate September Edition',
              desc: 'Ranked #1,482 out of 3,062 candidates. Demonstrated advanced skills in Autonomous AI Agents and Exploratory Data Analysis (EDA).',
              tags: ['Rank #1482', 'AI Agents', 'EDA'],
              logoKey: 'hackerrank'
            }
          ]
        },
        {
          name: 'July 2026',
          items: [
            {
              issuer: 'Sreekrishnapuram V. T. Bhattathiripad College',
              date: 'Jul 2026',
              title: 'Resource Person – Evolution of AI: From ML to Autonomous AI Agents',
              desc: 'Invited speaker & resource person delivering academic session on ML architecture and Multi-Agent Orchestration.',
              tags: ['Speaker', 'AI Agents', 'Academic Session'],
              highlight: true,
              logoKey: 'academic'
            },
            {
              issuer: 'Anthropic',
              date: 'Jul 2026',
              title: 'AI Capabilities and Limitations',
              tags: ['Anthropic', 'AI Safety', 'Claude Architecture'],
              logoKey: 'anthropic'
            }
          ]
        },
        {
          name: 'May 2026',
          items: [
            {
              issuer: 'Cisco',
              date: 'May 2026',
              title: 'Introduction to Modern AI',
              tags: ['Cisco', 'Modern AI', 'Networking & AI'],
              logoKey: 'cisco'
            }
          ]
        },
        {
          name: 'March 2026',
          items: [
            {
              issuer: 'MULearn SIMAT (SPT)',
              date: 'Mar 2026',
              title: 'Build With AI Hackathon – Participation & Project Showcase',
              desc: 'Built Kerala Coastal Climate Visualizer using Python, Data Analytics & Gemini 2.5 Flash API.',
              tags: ['Hackathon', 'Gemini 2.5', 'Climate Tech'],
              highlight: true,
              logoKey: 'hackathon'
            },
            {
              issuer: 'Hindusthan College Of Arts And Science',
              date: 'Mar 2026',
              title: ' 🥇 1st Prize – Web Designing (SPYDER National Symposium)',
              desc: 'Awarded First Rank in National Level Technical Web Design Competition.',
              tags: ['★ 1st Prize Winner', 'National Winner', 'UI/UX Design'],
              prize: '🥇 1st Prize',
              badgeClass: 'gold-badge',
              logoKey: 'goldMedal'
            },
            {
              issuer: 'Hindusthan College Of Arts And Science',
              date: 'Mar 2026',
              title: '🥉 3rd Prize – Code Debugging Event (SPYDER Symposium)',
              tags: ['3rd Prize', 'Code Debugging', 'Algorithms'],
              prize: '🥉 3rd Prize',
              badgeClass: 'bronze-badge',
              logoKey: 'bronzeMedal'
            }
          ]
        },
        {
          name: 'February 2026',
          items: [
            {
              issuer: 'National Testing Agency (NTA)',
              date: 'Feb 2026',
              title: '🎓 UGC-NET – Qualified for Admission to Ph.D. in Computer Science',
              desc: 'National Eligibility Test Qualification in Computer Science and Applications (Code 087).',
              tags: ['UGC-NET', 'Ph.D. Qualified', 'Computer Science'],
              highlight: true,
              logoKey: 'nta'
            },
            {
              issuer: 'University of Calicut (CCSIT)',
              date: 'Feb 2026',
              title: 'INSIGHT\'26 – TECHNOVA 8.0',
              tags: ['CCSIT', 'Tech Fest'],
              logoKey: 'calicut'
            },
            {
              issuer: 'Nehru College of Management',
              date: 'Feb 2026',
              title: '🥈 2nd Prize – Web Designing (GENESIS 2026)',
              tags: ['2nd Prize Winner', 'Web Design'],
              prize: '🥈 2nd Prize',
              badgeClass: 'silver-badge',
              logoKey: 'silverMedal'
            },
            {
              issuer: 'CodeAlpha',
              date: 'Feb 2026',
              title: 'Data Analytics Virtual Internship Certificate',
              tags: ['Data Analytics', 'Internship'],
              logoKey: 'codealpha'
            },
            {
              issuer: 'IBM',
              date: 'Feb 2026',
              title: 'AI Fundamentals: Foundations for Understanding AI',
              tags: ['IBM', 'AI Foundations'],
              logoKey: 'ibm'
            },
            {
              issuer: 'HP LIFE',
              date: 'Feb 2026',
              title: 'AI for Beginners',
              tags: ['HP LIFE', 'AI Literacy'],
              logoKey: 'hp'
            }
          ]
        },
        {
          name: 'January 2026',
          items: [
            {
              issuer: 'SreeKrishnapuram V.T. Bhattathiripad College',
              date: 'Jan 2026',
              title: '🥇 Quiz Competition First Position (BHAVANA 2025–26)',
              tags: ['1st Position', 'General Quiz'],
              prize: '🥇 1st Prize',
              badgeClass: 'gold-badge',
              logoKey: 'goldMedal'
            },
            {
              issuer: 'MES College Marampally',
              date: 'Jan 2026',
              title: 'INKRIT 4.0 Hackathon',
              tags: ['Hackathon', 'Innovation'],
              logoKey: 'hackathon'
            }
          ]
        }
      ]
    },
    {
      year: '2025',
      months: [
        {
          name: 'October 2025',
          items: [
            {
              issuer: 'Oracle',
              date: 'Oct 2025 – Oct 2027',
              title: 'Oracle Cloud Infrastructure 2025 AI Foundations Associate',
              tags: ['Oracle Cloud', 'OCI AI', 'Certified Associate'],
              highlight: true,
              logoKey: 'oracle'
            },
            {
              issuer: 'Google Cloud Skills Boost',
              date: 'Oct 2025',
              title: 'Gemini For Data Scientists And Analysts',
              tags: ['Google Gemini', 'Data Analytics'],
              logoKey: 'google'
            },
            {
              issuer: 'HackerRank',
              date: 'Oct 2025',
              title: 'SQL (Intermediate) & Problem Solving Certificates',
              tags: ['SQL', 'Problem Solving'],
              logoKey: 'hackerrank'
            }
          ]
        },
        {
          name: 'September 2025',
          items: [
            {
              issuer: 'HackerRank',
              date: 'Sep 2025',
              title: 'Python (Basic) Certificate',
              tags: ['Python', 'HackerRank'],
              logoKey: 'hackerrank'
            }
          ]
        },
        {
          name: 'May 2025',
          items: [
            {
              issuer: 'Intel',
              date: 'May 2025',
              title: 'AI Appreciate & AI Aware Badges (AI For All)',
              tags: ['Intel', 'AI For All'],
              logoKey: 'intel'
            },
            {
              issuer: 'Sololearn',
              date: 'May 2025',
              title: 'Python Developer & Intro to Python Certification',
              tags: ['Python', 'Developer'],
              logoKey: 'sololearn'
            }
          ]
        },
        {
          name: 'March 2025',
          items: [
            {
              issuer: 'Indian Institute of Technology, Madras (NPTEL)',
              date: 'Mar 2025',
              title: 'Python For Data Science (IIT Madras NPTEL)',
              tags: ['IIT Madras', 'NPTEL', 'Data Science'],
              highlight: true,
              logoKey: 'academic'
            }
          ]
        }
      ]
    },
    {
      year: '2024',
      months: [
        {
          name: '2024 Milestones',
          items: [
            {
              issuer: 'Tata Consultancy Services (TCS iON)',
              date: 'Dec 2024',
              title: 'TCS iON Career Edge – Young Professional',
              tags: ['TCS iON', 'Corporate Skills'],
              highlight: true,
              logoKey: 'tcs'
            },
            {
              issuer: 'LBS Centre For Science & Technology',
              date: 'Aug 2024',
              title: 'Certificate Course in Python Programming',
              tags: ['LBS Centre', 'Python'],
              logoKey: 'codealpha'
            }
          ]
        }
      ]
    }
  ];

  const filteredCerts = certsData.map(group => {
    if (selectedYear !== 'ALL' && group.year !== selectedYear) return null;

    const filteredMonths = group.months.map(month => {
      const matchingItems = month.items.filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.issuer.toLowerCase().includes(q) ||
          item.tags.some(t => t.toLowerCase().includes(q))
        );
      });
      if (matchingItems.length === 0) return null;
      return { ...month, items: matchingItems };
    }).filter(Boolean);

    if (filteredMonths.length === 0) return null;
    return { ...group, months: filteredMonths };
  }).filter(Boolean);

  return (
    <div className="main-content">
      {/* Page Header Section */}
      <section className="portfolio-section cert-hero-section">
        <div className="cert-hero-container">
          <div className="cert-back-bar">
            <button
              onClick={onBack}
              className="cert-back-link"
              style={{ background: 'var(--paper-card)', border: '2px solid var(--ink-border)', cursor: 'pointer' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Home</span>
            </button>
          </div>

          <h1 className="hero-title cert-page-title">
            <span className="hero-name-primary">LICENSES &</span>
            <span className="hero-name-secondary">CERTIFICATIONS</span>
          </h1>

          <p className="cert-page-desc">
            Timeline of accredited licenses, certifications, UGC-NET qualification, and national hackathon prizes by KN Farhan Nazim.
          </p>

          {/* Stats Bar */}
          <div className="cert-stats-row">
            <div className="cert-stat-pill">
              <span className="stat-bullet">●</span>
              <span>28 Accredited Milestones</span>
            </div>
            <div className="cert-stat-pill">
              <span className="stat-bullet">✦</span>
              <span>UGC-NET Qualified (CS)</span>
            </div>
            <div className="cert-stat-pill">
              <span className="stat-bullet">★</span>
              <span>National Hackathon & Web Design Prizes</span>
            </div>
          </div>

          {/* Quick Jump Filters & Live Search */}
          <div className="cert-year-filter">
            <span className="filter-label">FILTER BY YEAR:</span>
            {['ALL', '2026', '2025', '2024'].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`year-chip ${selectedYear === yr ? 'active' : ''}`}
                style={{
                  background: selectedYear === yr ? 'var(--ink)' : 'var(--paper)',
                  color: selectedYear === yr ? 'var(--paper)' : 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                {yr}
              </button>
            ))}

            <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search certs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', width: 220 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Content Section */}
      <section className="portfolio-section cert-timeline-section">
        <div className="cert-timeline-container">
          {filteredCerts.map((group) => (
            <div key={group.year} id={`year-${group.year}`} className="cert-year-group">
              <div className="year-header-badge">
                <span className="year-number">{group.year}</span>
                <span className="year-line"></span>
              </div>

              {group.months.map((month, mIdx) => (
                <div key={mIdx} className="month-block">
                  <h3 className="month-title">{month.name}</h3>
                  <div className="cert-grid">
                    {month.items.map((item, iIdx) => {
                      const logoSvg = providerLogos[item.logoKey] || providerLogos.academic;
                      return (
                        <div
                          key={iIdx}
                          className={`cert-card ${item.highlight ? 'highlight-card' : ''} ${item.prize ? 'prize-card' : ''}`}
                        >
                          {item.prize && (
                            <span className={`cert-card-badge ${item.badgeClass || 'gold-badge'}`}>
                              {item.prize}
                            </span>
                          )}

                          <div
                            className="cert-logo-box"
                            title={item.issuer}
                            dangerouslySetInnerHTML={{ __html: logoSvg }}
                          />

                          <div className="cert-card-body">
                            <div className="cert-card-header">
                              <span className="cert-issuer">{item.issuer}</span>
                              <span className="cert-date">{item.date}</span>
                            </div>
                            <h4 className="cert-title">{item.title}</h4>
                            {item.desc && <p className="cert-desc">{item.desc}</p>}

                            <div className="cert-tags">
                              {item.tags.map((tg, tIdx) => (
                                <span key={tIdx} className="cert-tag">{tg}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
