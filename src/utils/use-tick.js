import { useEffect } from 'react';
import databus from '@/core/databus';

export const useRenderUpdate = (cb, deps) => {
  useEffect(() => {
    databus.renderUpdateList = databus.renderUpdateList || [];
    const len = databus.renderUpdateList.length;
    databus.renderUpdateList.push(cb);
    return () => {
      databus.renderUpdateList = databus.renderUpdateList.filter((d, i) => i !== len);
    }
  }, deps);
}

export const useLogicUpdate = (cb, deps) => {
  useEffect(() => {
    databus.logicUpdateList = databus.logicUpdateList || [];
    const len = databus.logicUpdateList.length;
    databus.logicUpdateList.push(cb);
    return () => {
      databus.logicUpdateList = databus.logicUpdateList.filter((d, i) => i !== len);
    }
  }, deps);
}

export const usePreditUpdate = (cb, deps) => {
  useEffect(() => {
    databus.preditUpdateList = databus.preditUpdateList || [];
    const len = databus.preditUpdateList.length;
    databus.preditUpdateList.push(cb);
    return () => {
      databus.preditUpdateList = databus.preditUpdateList.filter((d, i) => i !== len);
    }
  }, deps);
}