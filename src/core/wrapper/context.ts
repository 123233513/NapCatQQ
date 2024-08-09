import { LogWrapper } from "@/common/utils/log";
import { QQBasicInfoWrapper } from "@/common/utils/QQBasicInfo";
import { NapCatCoreWorkingEnv } from "@/core";
import { SelfInfo } from "../entities";
import { NodeIKernelLoginService } from "../services";
import { WrapperNodeApi, NodeIQQNTWrapperSession } from "@/core";
import { NTQQFileApi, NTQQFriendApi, NTQQGroupApi, NTQQMsgApi, NTQQSystemApi, NTQQUserApi, NTQQWebApi } from "../apis";
import { NTQQCollectionApi } from "../apis/collection";

export interface InstanceContext {
    readonly workingEnv: NapCatCoreWorkingEnv;
    readonly wrapper: WrapperNodeApi;
    readonly session: NodeIQQNTWrapperSession;
    readonly logger: LogWrapper;
    readonly loginService: NodeIKernelLoginService;
    readonly basicInfoWrapper: QQBasicInfoWrapper;
}
export interface NTApiContext {
    FileApi: NTQQFileApi,
    SystemApi: NTQQSystemApi,
    CollectionApi: NTQQCollectionApi,
    WebApi: NTQQWebApi,
    FriendApi: NTQQFriendApi,
    MsgApi: NTQQMsgApi,
    UserApi: NTQQUserApi,
    GroupApi: NTQQGroupApi
}