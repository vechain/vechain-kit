/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface TreasuryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "DEFAULT_ADMIN_ROLE"
      | "GOVERNANCE_ROLE"
      | "PAUSER_ROLE"
      | "UPGRADER_ROLE"
      | "UPGRADE_INTERFACE_VERSION"
      | "VTHO"
      | "b3trAddress"
      | "convertB3TR"
      | "convertVOT3"
      | "getB3TRBalance"
      | "getCollectionNFTBalance"
      | "getERC1155TokenBalance"
      | "getRoleAdmin"
      | "getTokenBalance"
      | "getTransferLimitToken"
      | "getTransferLimitVET"
      | "getVETBalance"
      | "getVOT3Balance"
      | "getVTHOBalance"
      | "grantRole"
      | "hasRole"
      | "initialize"
      | "onERC1155BatchReceived"
      | "onERC1155Received"
      | "onERC721Received"
      | "pause"
      | "paused"
      | "proxiableUUID"
      | "renounceRole"
      | "revokeRole"
      | "setTransferLimitToken"
      | "setTransferLimitVET"
      | "supportsInterface"
      | "transferB3TR"
      | "transferERC1155Tokens"
      | "transferNFT"
      | "transferTokens"
      | "transferVET"
      | "transferVOT3"
      | "transferVTHO"
      | "unpause"
      | "upgradeToAndCall"
      | "version"
      | "vot3Address"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Initialized"
      | "Paused"
      | "RoleAdminChanged"
      | "RoleGranted"
      | "RoleRevoked"
      | "TransferLimitUpdated"
      | "TransferLimitVETUpdated"
      | "Unpaused"
      | "Upgraded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "GOVERNANCE_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "PAUSER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "UPGRADER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "UPGRADE_INTERFACE_VERSION",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "VTHO", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "b3trAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "convertB3TR",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "convertVOT3",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getB3TRBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCollectionNFTBalance",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getERC1155TokenBalance",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenBalance",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTransferLimitToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTransferLimitVET",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVETBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVOT3Balance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVTHOBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      AddressLike,
      AddressLike,
      AddressLike,
      AddressLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC1155BatchReceived",
    values: [
      AddressLike,
      AddressLike,
      BigNumberish[],
      BigNumberish[],
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC1155Received",
    values: [AddressLike, AddressLike, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setTransferLimitToken",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setTransferLimitVET",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferB3TR",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferERC1155Tokens",
    values: [AddressLike, AddressLike, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferNFT",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferTokens",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferVET",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferVOT3",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferVTHO",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "version", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "vot3Address",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "GOVERNANCE_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "PAUSER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "UPGRADER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "UPGRADE_INTERFACE_VERSION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "VTHO", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "b3trAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "convertB3TR",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "convertVOT3",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getB3TRBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCollectionNFTBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getERC1155TokenBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTransferLimitToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTransferLimitVET",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVETBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVOT3Balance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVTHOBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155BatchReceived",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTransferLimitToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTransferLimitVET",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferB3TR",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferERC1155Tokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferNFT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferVET",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferVOT3",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferVTHO",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "version", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "vot3Address",
    data: BytesLike
  ): Result;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleAdminChangedEvent {
  export type InputTuple = [
    role: BytesLike,
    previousAdminRole: BytesLike,
    newAdminRole: BytesLike
  ];
  export type OutputTuple = [
    role: string,
    previousAdminRole: string,
    newAdminRole: string
  ];
  export interface OutputObject {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleGrantedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleRevokedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferLimitUpdatedEvent {
  export type InputTuple = [token: AddressLike, limit: BigNumberish];
  export type OutputTuple = [token: string, limit: bigint];
  export interface OutputObject {
    token: string;
    limit: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferLimitVETUpdatedEvent {
  export type InputTuple = [limit: BigNumberish];
  export type OutputTuple = [limit: bigint];
  export interface OutputObject {
    limit: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnpausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpgradedEvent {
  export type InputTuple = [implementation: AddressLike];
  export type OutputTuple = [implementation: string];
  export interface OutputObject {
    implementation: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Treasury extends BaseContract {
  connect(runner?: ContractRunner | null): Treasury;
  waitForDeployment(): Promise<this>;

  interface: TreasuryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  DEFAULT_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  GOVERNANCE_ROLE: TypedContractMethod<[], [string], "view">;

  PAUSER_ROLE: TypedContractMethod<[], [string], "view">;

  UPGRADER_ROLE: TypedContractMethod<[], [string], "view">;

  UPGRADE_INTERFACE_VERSION: TypedContractMethod<[], [string], "view">;

  VTHO: TypedContractMethod<[], [string], "view">;

  b3trAddress: TypedContractMethod<[], [string], "view">;

  convertB3TR: TypedContractMethod<
    [_b3trAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  convertVOT3: TypedContractMethod<
    [_vot3Amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getB3TRBalance: TypedContractMethod<[], [bigint], "view">;

  getCollectionNFTBalance: TypedContractMethod<
    [_nft: AddressLike],
    [bigint],
    "view"
  >;

  getERC1155TokenBalance: TypedContractMethod<
    [_token: AddressLike, _id: BigNumberish],
    [bigint],
    "view"
  >;

  getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;

  getTokenBalance: TypedContractMethod<[_token: AddressLike], [bigint], "view">;

  getTransferLimitToken: TypedContractMethod<
    [_token: AddressLike],
    [bigint],
    "view"
  >;

  getTransferLimitVET: TypedContractMethod<[], [bigint], "view">;

  getVETBalance: TypedContractMethod<[], [bigint], "view">;

  getVOT3Balance: TypedContractMethod<[], [bigint], "view">;

  getVTHOBalance: TypedContractMethod<[], [bigint], "view">;

  grantRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  hasRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;

  initialize: TypedContractMethod<
    [
      _b3tr: AddressLike,
      _vot3: AddressLike,
      _timeLock: AddressLike,
      _admin: AddressLike,
      _proxyAdmin: AddressLike,
      _pauser: AddressLike,
      _transferLimitVET: BigNumberish,
      _transferLimitB3TR: BigNumberish,
      _transferLimitVOT3: BigNumberish,
      _transferLimitVTHO: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  onERC1155BatchReceived: TypedContractMethod<
    [
      arg0: AddressLike,
      arg1: AddressLike,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike
    ],
    [string],
    "nonpayable"
  >;

  onERC1155Received: TypedContractMethod<
    [
      arg0: AddressLike,
      arg1: AddressLike,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike
    ],
    [string],
    "nonpayable"
  >;

  onERC721Received: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish, arg3: BytesLike],
    [string],
    "view"
  >;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  renounceRole: TypedContractMethod<
    [role: BytesLike, callerConfirmation: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  setTransferLimitToken: TypedContractMethod<
    [_token: AddressLike, _transferLimit: BigNumberish],
    [void],
    "nonpayable"
  >;

  setTransferLimitVET: TypedContractMethod<
    [_transferLimitVET: BigNumberish],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  transferB3TR: TypedContractMethod<
    [_to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferERC1155Tokens: TypedContractMethod<
    [
      _tokenAddress: AddressLike,
      _to: AddressLike,
      _id: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  transferNFT: TypedContractMethod<
    [_nft: AddressLike, _to: AddressLike, _tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferTokens: TypedContractMethod<
    [_token: AddressLike, _to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferVET: TypedContractMethod<
    [_to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferVOT3: TypedContractMethod<
    [_to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferVTHO: TypedContractMethod<
    [_to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  upgradeToAndCall: TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  version: TypedContractMethod<[], [string], "view">;

  vot3Address: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "DEFAULT_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "GOVERNANCE_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "PAUSER_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "UPGRADER_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "UPGRADE_INTERFACE_VERSION"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "VTHO"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "b3trAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "convertB3TR"
  ): TypedContractMethod<[_b3trAmount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "convertVOT3"
  ): TypedContractMethod<[_vot3Amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getB3TRBalance"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getCollectionNFTBalance"
  ): TypedContractMethod<[_nft: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getERC1155TokenBalance"
  ): TypedContractMethod<
    [_token: AddressLike, _id: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRoleAdmin"
  ): TypedContractMethod<[role: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getTokenBalance"
  ): TypedContractMethod<[_token: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getTransferLimitToken"
  ): TypedContractMethod<[_token: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getTransferLimitVET"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getVETBalance"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getVOT3Balance"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getVTHOBalance"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "grantRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "hasRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [
      _b3tr: AddressLike,
      _vot3: AddressLike,
      _timeLock: AddressLike,
      _admin: AddressLike,
      _proxyAdmin: AddressLike,
      _pauser: AddressLike,
      _transferLimitVET: BigNumberish,
      _transferLimitB3TR: BigNumberish,
      _transferLimitVOT3: BigNumberish,
      _transferLimitVTHO: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "onERC1155BatchReceived"
  ): TypedContractMethod<
    [
      arg0: AddressLike,
      arg1: AddressLike,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "onERC1155Received"
  ): TypedContractMethod<
    [
      arg0: AddressLike,
      arg1: AddressLike,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "onERC721Received"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish, arg3: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "pause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "proxiableUUID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceRole"
  ): TypedContractMethod<
    [role: BytesLike, callerConfirmation: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "revokeRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setTransferLimitToken"
  ): TypedContractMethod<
    [_token: AddressLike, _transferLimit: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setTransferLimitVET"
  ): TypedContractMethod<
    [_transferLimitVET: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "transferB3TR"
  ): TypedContractMethod<
    [_to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferERC1155Tokens"
  ): TypedContractMethod<
    [
      _tokenAddress: AddressLike,
      _to: AddressLike,
      _id: BigNumberish,
      _value: BigNumberish,
      _data: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferNFT"
  ): TypedContractMethod<
    [_nft: AddressLike, _to: AddressLike, _tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferTokens"
  ): TypedContractMethod<
    [_token: AddressLike, _to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferVET"
  ): TypedContractMethod<
    [_to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferVOT3"
  ): TypedContractMethod<
    [_to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferVTHO"
  ): TypedContractMethod<
    [_to: AddressLike, _value: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "unpause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgradeToAndCall"
  ): TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "version"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "vot3Address"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "Paused"
  ): TypedContractEvent<
    PausedEvent.InputTuple,
    PausedEvent.OutputTuple,
    PausedEvent.OutputObject
  >;
  getEvent(
    key: "RoleAdminChanged"
  ): TypedContractEvent<
    RoleAdminChangedEvent.InputTuple,
    RoleAdminChangedEvent.OutputTuple,
    RoleAdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "RoleGranted"
  ): TypedContractEvent<
    RoleGrantedEvent.InputTuple,
    RoleGrantedEvent.OutputTuple,
    RoleGrantedEvent.OutputObject
  >;
  getEvent(
    key: "RoleRevoked"
  ): TypedContractEvent<
    RoleRevokedEvent.InputTuple,
    RoleRevokedEvent.OutputTuple,
    RoleRevokedEvent.OutputObject
  >;
  getEvent(
    key: "TransferLimitUpdated"
  ): TypedContractEvent<
    TransferLimitUpdatedEvent.InputTuple,
    TransferLimitUpdatedEvent.OutputTuple,
    TransferLimitUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "TransferLimitVETUpdated"
  ): TypedContractEvent<
    TransferLimitVETUpdatedEvent.InputTuple,
    TransferLimitVETUpdatedEvent.OutputTuple,
    TransferLimitVETUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "Unpaused"
  ): TypedContractEvent<
    UnpausedEvent.InputTuple,
    UnpausedEvent.OutputTuple,
    UnpausedEvent.OutputObject
  >;
  getEvent(
    key: "Upgraded"
  ): TypedContractEvent<
    UpgradedEvent.InputTuple,
    UpgradedEvent.OutputTuple,
    UpgradedEvent.OutputObject
  >;

  filters: {
    "Initialized(uint64)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "Paused(address)": TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;
    Paused: TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)": TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;
    RoleAdminChanged: TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;

    "RoleGranted(bytes32,address,address)": TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;
    RoleGranted: TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;

    "RoleRevoked(bytes32,address,address)": TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
    RoleRevoked: TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;

    "TransferLimitUpdated(address,uint256)": TypedContractEvent<
      TransferLimitUpdatedEvent.InputTuple,
      TransferLimitUpdatedEvent.OutputTuple,
      TransferLimitUpdatedEvent.OutputObject
    >;
    TransferLimitUpdated: TypedContractEvent<
      TransferLimitUpdatedEvent.InputTuple,
      TransferLimitUpdatedEvent.OutputTuple,
      TransferLimitUpdatedEvent.OutputObject
    >;

    "TransferLimitVETUpdated(uint256)": TypedContractEvent<
      TransferLimitVETUpdatedEvent.InputTuple,
      TransferLimitVETUpdatedEvent.OutputTuple,
      TransferLimitVETUpdatedEvent.OutputObject
    >;
    TransferLimitVETUpdated: TypedContractEvent<
      TransferLimitVETUpdatedEvent.InputTuple,
      TransferLimitVETUpdatedEvent.OutputTuple,
      TransferLimitVETUpdatedEvent.OutputObject
    >;

    "Unpaused(address)": TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
    Unpaused: TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;

    "Upgraded(address)": TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
    Upgraded: TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
  };
}
