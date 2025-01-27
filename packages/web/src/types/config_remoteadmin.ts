import * as T from 'runtypes';

export const TypeRemoteAdminMember = T.Record(T.String, T.String).withConstraint((x) =>
  (Object.keys(x).length === 1) &&
  (Object.values(x).length === 1) &&
  (/.*@(steam|discord|northwood)/g.test(Object.keys(x)[0]!))
);

export type RemoteAdminMember = T.Static<typeof TypeRemoteAdminMember>;

export const TypeColors = T.Union(
  T.Literal("pink"),
  T.Literal("red"),
  T.Literal("brown"),
  T.Literal("silver"),
  T.Literal("light_green"),
  T.Literal("crimson"),
  T.Literal("cyan"),
  T.Literal("aqua"),
  T.Literal("deep_pink"),
  T.Literal("tomato"),
  T.Literal("yellow"),
  T.Literal("magenta"),
  T.Literal("blue_green"),
  T.Literal("orange"),
  T.Literal("lime"),
  T.Literal("green"),
  T.Literal("emerald"),
  T.Literal("carmine"),
  T.Literal("nickel"),
  T.Literal("mint"),
  T.Literal("army_green"),
  T.Literal("pumpkin"),
  T.Literal("gold"),
  T.Literal("teal"),
  T.Literal("blue"),
  T.Literal("purple"),
  T.Literal("light_red"),
  T.Literal("silver_blue"),
  T.Literal("police_blue"),
);

export type Colors = T.Static<typeof TypeColors>;

export const TypeRoleProperty = T.Object({
  badge: T.String,
  color: TypeColors,
  cover: T.Boolean,
  hidden: T.Boolean,
  kick_power: T.Number.withConstraint(Number.isInteger),
  required_kick_power: T.Number.withConstraint(Number.isInteger)
});

export type RoleProperty = T.Static<typeof TypeRoleProperty>;

export const TypePermissions = T.Union(
  T.Literal("KickingAndShortTermBanning"),
  T.Literal("BanningUpToDay"),
  T.Literal("LongTermBanning"),
  T.Literal("ForceclassSelf"),
  T.Literal("ForceclassToSpectator"),
  T.Literal("ForceclassWithoutRestrictions"),
  T.Literal("GivingItems"),
  T.Literal("WarheadEvents"),
  T.Literal("RespawnEvents"),
  T.Literal("RoundEvents"),
  T.Literal("SetGroup"),
  T.Literal("GameplayData"),
  T.Literal("Overwatch"),
  T.Literal("FacilityManagement"),
  T.Literal("PlayersManagement"),
  T.Literal("PermissionsManagement"),
  T.Literal("ServerConsoleCommands"),
  T.Literal("ViewHiddenBadge"),
  T.Literal("ServerConfigs"),
  T.Literal("Broadcasting"),
  T.Literal("PlayerSensitiveDataAccess"),
  T.Literal("Noclip"),
  T.Literal("AFKImmunity"),
  T.Literal("AdminChat"),
  T.Literal("ViewHiddenGlobalBadges"),
  T.Literal("Announcer"),
  T.Literal("Effects"),
  T.Literal("FriendlyFireDetectorImmunity"),
  T.Literal("FriendlyFireDetectorTempDisable"),
);

export type Permissions = T.Static<typeof TypePermissions>;

export const TypeRemoteAdminConfig = T.Object({
  Members: T.Array(TypeRemoteAdminMember),
  enable_staff_access: T.Boolean,
  enable_manager_access: T.Boolean,
  enable_banteam_access: T.Boolean,
  enable_banteam_reserved_slots: T.Boolean,
  enable_banteam_bypass_geoblocking: T.Boolean,
  role_properties: T.Record(T.String, TypeRoleProperty),
  Roles: T.Array(T.String),
  Permissions: T.Array(T.Record(TypePermissions, T.Array(T.String)).withConstraint((x) => Object.keys(x).length === 1)),
  override_password: T.String,
  override_password_role: T.String,
  allow_central_server_commands_as_ServerConsoleCommands: T.Boolean,
  enable_predefined_ban_templates: T.Boolean,
  PredefinedBanTemplates: T.Array(T.Tuple(T.Number.withConstraint(n => n >= 0), T.String.withConstraint(x => !x.includes(','))))
}).withConstraint((x) =>
  (x.Members.filter((y) => !x.Roles.includes(Object.values(y)[0]!)).length === 0) &&
  (Object.keys(x.role_properties).filter((y) => !x.Roles.includes(y)).length === 0) &&
  (x.Permissions.flatMap((y) => Object.values(y)[0]!).filter((y) => !x.Roles.includes(y)).length === 0)
);

export type RemoteAdminConfig = T.Static<typeof TypeRemoteAdminConfig>;