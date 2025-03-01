/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  GovernorFunctionRestrictionsLogic,
  GovernorFunctionRestrictionsLogicInterface,
} from "../../../../contracts/governance/libraries/GovernorFunctionRestrictionsLogic";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "selector",
        type: "bytes",
      },
    ],
    name: "GovernorFunctionInvalidSelector",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "functionSelector",
        type: "bytes4",
      },
    ],
    name: "GovernorRestrictedFunction",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes4",
        name: "functionSelector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isWhitelisted",
        type: "bool",
      },
    ],
    name: "FunctionWhitelisted",
    type: "event",
  },
] as const;

const _bytecode =
  "0x61043461003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361061004b5760003560e01c80631a66a5751461005057806335ca71ca146100845780634373cc40146100a4575b600080fd5b81801561005c57600080fd5b5061008261006b36600461021d565b600991909101805460ff1916911515919091179055565b005b81801561009057600080fd5b5061008261009f36600461028e565b6100c4565b8180156100b057600080fd5b506100826100bf36600461037f565b61010e565b60005b8251811015610107576100f585858584815181106100e7576100e76103c1565b60200260200101518561010e565b806100ff816103d7565b9150506100c7565b5050505050565b6001600160a01b03831661018e5760405162461bcd60e51b815260206004820152603d60248201527f476f7665726e6f7246756e6374696f6e5265737472696374696f6e734c6f676960448201527f633a2074617267657420697320746865207a65726f2061646472657373000000606482015260840160405180910390fd5b6001600160a01b038316600081815260088601602090815260408083206001600160e01b0319871680855290835292819020805460ff191686151590811790915590519081529192917f5da7b78f7dccc6b378e3f55a7e57f9363d3c15686c0d82f85e45130393c9c970910160405180910390a350505050565b8035801515811461021857600080fd5b919050565b6000806040838503121561023057600080fd5b8235915061024060208401610208565b90509250929050565b80356001600160a01b038116811461021857600080fd5b634e487b7160e01b600052604160045260246000fd5b80356001600160e01b03198116811461021857600080fd5b600080600080608085870312156102a457600080fd5b8435935060206102b5818701610249565b935060408601356001600160401b03808211156102d157600080fd5b818801915088601f8301126102e557600080fd5b8135818111156102f7576102f7610260565b8060051b604051601f19603f8301168101818110858211171561031c5761031c610260565b60405291825284820192508381018501918b83111561033a57600080fd5b938501935b8285101561035f5761035085610276565b8452938501939285019261033f565b80975050505050505061037460608601610208565b905092959194509250565b6000806000806080858703121561039557600080fd5b843593506103a560208601610249565b92506103b360408601610276565b915061037460608601610208565b634e487b7160e01b600052603260045260246000fd5b6000600182016103f757634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220f2b180971df7c10e6b4a518dc755eea3d145dabba108bb1e520259f196ad071064736f6c63430008140033";

type GovernorFunctionRestrictionsLogicConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GovernorFunctionRestrictionsLogicConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GovernorFunctionRestrictionsLogic__factory extends ContractFactory {
  constructor(...args: GovernorFunctionRestrictionsLogicConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      GovernorFunctionRestrictionsLogic & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): GovernorFunctionRestrictionsLogic__factory {
    return super.connect(runner) as GovernorFunctionRestrictionsLogic__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GovernorFunctionRestrictionsLogicInterface {
    return new Interface(_abi) as GovernorFunctionRestrictionsLogicInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): GovernorFunctionRestrictionsLogic {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as GovernorFunctionRestrictionsLogic;
  }
}
