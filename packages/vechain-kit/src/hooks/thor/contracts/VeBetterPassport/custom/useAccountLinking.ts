import {
    useGetEntitiesLinkedToPassport,
    useGetPassportForEntity,
    useGetUserPendingLinkings,
    useIsUserEntity,
} from '@/hooks/thor/contracts/VeBetterPassport';
import { useMemo } from 'react';

/**
 * Hook to get the account linking status of the current user.
 *
 * @param {string} user - The address of the user to check.
 * @returns The account linking status of the current user.
 */
export const useAccountLinking = (user?: string) => {
    const { data: isEntity, isLoading: isEntityLoading } = useIsUserEntity();
    const {
        data: userLinkedEntities = [],
        isLoading: isUserLinkedEntitiesLoading,
    } = useGetEntitiesLinkedToPassport(user);
    const isPassport = !isEntity && userLinkedEntities?.length > 0;

    // if the user is an entity, get the passport for that entity
    const { data: entityPassport, isLoading: isEntityPassportLoading } =
        useGetPassportForEntity(!!isEntity ? user : undefined);
    const isLinked = !!isPassport || !!isEntity;

    // if the user is an entity, use the entity's passport, otherwise use the user's account
    const passport = useMemo(() => {
        if (isEntity) return entityPassport ?? undefined;
        if (isPassport) return user;
        return undefined;
    }, [isEntity, entityPassport, isPassport, user]);

    // if linked, get the entities linked to the passport
    const {
        data: passportLinkedEntities,
        isLoading: isPassportLinkedEntitiesLoading,
    } = useGetEntitiesLinkedToPassport(isLinked ? passport : undefined);

    const { data: pendingLinkings, isLoading: isPendingLinkingsLoading } =
        useGetUserPendingLinkings();

    const incomingPendingLinkings = pendingLinkings?.incoming || [];
    const outgoingPendingLink = Number(pendingLinkings?.outgoing)
        ? pendingLinkings?.outgoing
        : undefined;

    const isLoading =
        isUserLinkedEntitiesLoading ||
        isPassportLinkedEntitiesLoading ||
        isEntityPassportLoading ||
        isEntityLoading ||
        isPendingLinkingsLoading;

    return {
        isLinked,
        passport,
        isPassport,
        isEntity,
        passportLinkedEntities: passportLinkedEntities ?? [],
        incomingPendingLinkings,
        outgoingPendingLink,
        isLoading,
    };
};
