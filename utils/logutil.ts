import {BigNumber} from 'ethers';

export function getEtherStringResultObj(obj: any) {
  if (Object.prototype.hasOwnProperty.call(obj, '_isBigNumber')) {
    return obj.toString();
  }
  return Object.keys(obj)
    .filter((key) => !/^\d+$/.test(key))
    .reduce((p, u) => {
      p[u] = obj[u].toString();
      return p;
    }, {} as any);
}

export function getEtherStringResultArray(obj: any[]) {
  return obj.map(getEtherStringResultObj);
}

export function printEtherResult(result: any, name?: string) {
  if (name) {
    console.log(`------------------------ ${name}------------------------`);
  }
  console.table(getEtherStringResultObj(result));
}

export function printEtherResultArray(result: any[], name?: string) {
  if (name) {
    console.log(`-------------- ${name} --------------`);
  }
  console.table(getEtherStringResultArray(result));
}

export function isBigNumber(obj:any) {
  return Object.prototype.hasOwnProperty.call(obj, "_isBigNumber");
}
export function equal(obj1:any, obj2:any) {
  if (isBigNumber(obj1) && isBigNumber(obj2)) {
    return obj1.eq(obj2);
  } else if (obj1 instanceof Array && obj2 instanceof Array) {
    if (obj1.length != obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!equal(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  } else if (typeof obj1 === "string" && typeof obj2 === "string") {
    return obj1.toLowerCase() === obj2.toLowerCase();
  } else if (isBigNumber(obj1) && typeof obj2 === "number") {
    return obj1.toNumber() === obj2;
  } else if (typeof obj1 === "number" && isBigNumber(obj2)) {
    return obj1 === obj2.toNumber();
  } else if (typeof obj1 === "string" && isBigNumber(obj2)) {
    return obj1 === obj2.toString();
  } else if (isBigNumber(obj1) && typeof obj2 === "string") {
    return obj1.toString() === obj2;
  }
  return obj1 === obj2;
}
