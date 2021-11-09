import { useEffect } from 'react';
import databus from '@/core/databus';

export const useRenderUpdate = (cb, deps) => {
  useEffect(() => {
    databus.renderUpdateList = databus.renderUpdateList || [];
    databus.renderUpdateList.push(cb);
    return () => {
      databus.renderUpdateList = databus.renderUpdateList.filter(d => d !== cb);
    }
  }, deps);
}

export const useLogicUpdate = (cb, deps) => {
  useEffect(() => {
    databus.logicUpdateList = databus.logicUpdateList || [];
    databus.logicUpdateList.push(cb);
    return () => {
      databus.logicUpdateList = databus.logicUpdateList.filter(d => d !== cb);
    }
  }, deps);
}

export const usePreditUpdate = (cb, deps) => {
  useEffect(() => {
    databus.preditUpdateList = databus.preditUpdateList || [];
    databus.preditUpdateList.push(cb);
    return () => {
      databus.preditUpdateList = databus.preditUpdateList.filter(d => d !== cb);
    }
  }, deps);
}