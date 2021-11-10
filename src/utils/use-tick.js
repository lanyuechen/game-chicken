import { useEffect } from 'react';
import databus from '@/core/databus';

export const useRenderUpdate = (cb) => {
  useEffect(() => {
    databus.renderUpdateList = databus.renderUpdateList || [];
    databus.renderUpdateList.push(cb);
    return () => {
      databus.renderUpdateList = databus.renderUpdateList.filter(d => d !== cb);
    }
  }, []);
}

export const useLogicUpdate = (cb) => {
  useEffect(() => {
    databus.logicUpdateList = databus.logicUpdateList || [];
    databus.logicUpdateList.push(cb);
    return () => {
      databus.logicUpdateList = databus.logicUpdateList.filter(d => d !== cb);
    }
  }, []);
}

export const usePreditUpdate = (cb) => {
  useEffect(() => {
    databus.preditUpdateList = databus.preditUpdateList || [];
    databus.preditUpdateList.push(cb);
    return () => {
      databus.preditUpdateList = databus.preditUpdateList.filter(d => d !== cb);
    }
  }, []);
}