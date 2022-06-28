import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import conf from '../../config.json';

export default function () {
  const ref = useRef(null);
  
  const upload = () => {
    let files = ref.current.files;
    if (files.length === 0) return;
    
    let form = new FormData();
    Object.keys(files).forEach(i => form.append('files', files[i]));

    axios.post('/api/upload/' + conf.id, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(({ data }) => {
      console.log(data);
    })
  }

  return (
    <section>
      <input type='file' ref={ref} onChange={upload} multiple />
    </section>
  )
}