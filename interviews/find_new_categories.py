from fileinput import filename
import json
import os, os.path
import matplotlib.pyplot as plt
import copy

datasOriginal = [
    {},
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {}
            },
            "COMBAT": {
                "NO_LESSON": {}
            },
            "LEGEND_SCALE_DIRECTION": {
                "NOT_INTUITIVE": {},
                "EMPIRICAL_DEDUCTION": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {}
            },
            "CODE_SMELLS": {
                "NOTICED": {}
            },
            "VULNS": {
                "NOTICED": {}
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {}
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {}
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {}
            },
            "FREQUENCY": {
                "RELEASE": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            }
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "DEV": {
                "MEDIUM": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {}
            },
            "FIXING": {
                "POSITIVE": {}
            }
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {}
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {}
            }
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            }
        }
    }
    ,
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
            },
            "LEGEND_SCALE_DIRECTION": {
                "NOT_INTUITIVE": {},
                "EMPIRICAL_DEDUCTION": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {}
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {}
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {},
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "ONE_MEANS_HIGH_MEANING": {},
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {}
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {}
            },
            "MOUSE": {
                "NOT_FOUND": {}
            }
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {}
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {}
            }
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {}
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "NOT_INTUITIVE": {},
                "USEFUL": {},
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
            },
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "INTUITIVE": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            }
        }
    }
    ,
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
            },
            "LEGEND_SCALE_DIRECTION": {
                "NOT_INTUITIVE": {},
                "EMPIRICAL_DEDUCTION": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {}
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {}
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {}
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "ONE_MEANS_HIGH_MEANING": {},
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTERS":{
                "ARE_ISSUES": {}
            },
            "MUSIC":{
                "IS_DANGER": {}
            },
            "COLORS":{
                "GENERAL_QUALITY": {}
            },
            "FILE_SIZE": {
                "ADD_MAPPING": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {}
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {}
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
            "DIG_KEY": {
                "INTERESTING": {}
            }
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {}
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {}
            },
            "CODEBASE_UNKNOWN": {
                "FILE_STRUCTURE_UNKNOWN": {}
            }
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            },
            "JUNIOR_DEV": {
                "POSITIVE": {}
            },
            "CODER": {
                "POSITIVE": {}
            },
            "MANAGER": {
                "POSITIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {}
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {}
            },
            "THREAT":{
                "BAD_CODE_ON_PURPOSE": {}
            }
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {}
            },
            "FREEZE_KEY": {
                "HARD_RECALL": {}
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "NOT_INTUITIVE": {},
                "USEFUL": {},
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
            },
            "FREEZE_NAME": {
                "UNCLEAR": {}
            },
            "FILE_HOVER": {
                "NOT_INTUITIVE": {}
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "INTUITIVE": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            }
        },
        "PROJECT_SELECTION":{
            "FIRST_ACTION": {
                "BROWSING": {}
            },
            "RECOMMENDED": {
                "UNNOTICED": {}
            }
        }
    }
    ,
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
            },
            "LEGEND_SCALE_DIRECTION": {
                "NOT_INTUITIVE": {},
                "EMPIRICAL_DEDUCTION": {},
                "REVERSED": {},
                "INTUITIVE": {}
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {}
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {}
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_GROUND": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {}
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_WALL": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "ONE_MEANS_HIGH_MEANING": {},
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTERS":{
                "ARE_ISSUES": {},
                "NOT_INTUITIVE": {}
            },
            "MUSIC":{
                "IS_DANGER": {}
            },
            "COLORS":{
                "GENERAL_QUALITY": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {}
            },
            "FILE_SIZE": {
                "ADD_MAPPING": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {}
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {}
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {},
                "NOT_FOUND": {},
                "NOT_USED": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
            "CONTROLS": {
                "INTUITIVE": {}
            },
            "TASKLIST": {
                "MISSING_HIGH": {}
            },
            "DIG_KEY": {
                "INTERESTING": {}
            }
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {}
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {}
            },
            "CODEBASE_UNKNOWN": {
                "FILE_STRUCTURE_UNKNOWN": {}
            }
        },
        "PROJECT_SELECTION":{
            "FIRST_ACTION": {
                "BROWSING": {}
            },
            "RECOMMENDED": {
                "UNNOTICED": {}
            },
            "WORK_WITH_LOCAL_FILES": {}
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            },
            "MANAGER": {
                "POSITIVE": {}
            },
            "JUNIOR_DEV": {
                "POSITIVE": {}
            },
            "SOLUTION_ARCHITECT": {
                "POSITIVE": {}
            },
            "CODER": {
                "POSITIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {}
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {}
            },
            "THREAT":{
                "BAD_CODE_ON_PURPOSE": {}
            }
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {}
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {}
            },
            "FREEZE_NAME": {
                "UNCLEAR": {}
            },
            "FREEZE_KEY": {
                "HARD_RECALL": {},
                "MISSED": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "NOT_INTUITIVE": {},
                "USEFUL": {},
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
                "NOT_INTUITIVE": {},
            },
            "FILE_HOVER": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {}
            },
            "NUMERICAL_VALUES": {
                "MISSING": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "INTUITIVE": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {},
                "NOT_INTUITIVE": {}
            },
            "MUSIC": {
                "TOO_NERVOUS": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            }
        }
    }
    ,
    #V5
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {},
                "COLORS_LINK_MISSING": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
            },
            "LEGEND_SCALE_DIRECTION": {
                "NOT_INTUITIVE": {},
                "EMPIRICAL_DEDUCTION": {},
                "REVERSED": {},
                "INTUITIVE": {}
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {}
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {}
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_GROUND": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {}
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_WALL": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "ONE_MEANS_HIGH_MEANING": {},
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTERS":{
                "ARE_ISSUES": {},
                "NOT_INTUITIVE": {}
            },
            "MUSIC":{
                "IS_DANGER": {}
            },
            "COLORS":{
                "GENERAL_QUALITY": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {}
            },
            "FILE_SIZE": {
                "ADD_MAPPING": {},
                "IS_SUB_DIR_SQUARE_SIZE": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {}
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {}
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {},
                "NOT_FOUND": {},
                "NOT_USED": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
            "CONTROLS": {
                "INTUITIVE": {}
            },
            "TASKLIST": {
                "MISSING_HIGH": {}
            },
            "DIG_KEY": {
                "INTERESTING": {}
            }
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {},
                "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {}
            },
            "CODEBASE_UNKNOWN": {
                "FILE_STRUCTURE_UNKNOWN": {}
            }
        },
        "PROJECT_SELECTION":{
            "FIRST_ACTION": {
                "BROWSING": {}
            },
            "RECOMMENDED": {
                "UNNOTICED": {}
            },
            "WORK_WITH_LOCAL_FILES": {}
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {},
                "POSITIVE": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            },
            "MANAGER": {
                "POSITIVE": {}
            },
            "JUNIOR_DEV": {
                "POSITIVE": {}
            },
            "SOLUTION_ARCHITECT": {
                "POSITIVE": {}
            },
            "CODER": {
                "POSITIVE": {}
            },
            "TESTER": {
                "POSITIVE": {}
            },
            "FUNCTIONAL_ANALYST": {
                "NEGATIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {}
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {}
            },
            "FIXING_RATIONALE": {
                "BEING_OVERWHELMED": {}
            },
            "REFERENCE_POINT_FOR_COMPARISON": {
                "MISSING": {}
            },
            "THREAT":{
                "BAD_CODE_ON_PURPOSE": {}
            },
            "MUST_KNOW_CODEBASE":{}
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {}
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {}
            },
            "FREEZE_NAME": {
                "UNCLEAR": {}
            },
            "FREEZE_KEY": {
                "HARD_RECALL": {},
                "MISSED": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "NOT_INTUITIVE": {},
                "USEFUL": {},
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
                "NOT_INTUITIVE": {},
            },
            "FILE_HOVER": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "MISSED": {}
            },
            "NUMERICAL_VALUES": {
                "MISSING": {}
            },
            "MONSTER_NB_TOT": {
                "INTUITIVE": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "INTUITIVE": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {},
                "NOT_INTUITIVE": {}
            },
            "MUSIC": {
                "TOO_NERVOUS": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            }
        }
    }
    ,
    #V6
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {},
                "COLORS_LINK_MISSING": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
            },
            "LEGEND_SCALE_DIRECTION": {
                "NOT_INTUITIVE": {},
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "REVERSED": {},
                "INTUITIVE": {}
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {}
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_GROUND": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {}
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_WALL": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "ONE_MEANS_HIGH_MEANING": {},
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTERS":{
                "ARE_ISSUES": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MUSIC":{
                "IS_DANGER": {}
            },
            "COLORS":{
                "GENERAL_QUALITY": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {}
            },
            "FILE_SIZE": {
                "ADD_MAPPING": {},
                "IS_SUB_DIR_SQUARE_SIZE": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {}
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {}
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {},
                "NOT_FOUND": {},
                "NOT_USED": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
            "CONTROLS": {
                "INTUITIVE": {}
            },
            "TASKLIST": {
                "MISSING_HIGH": {}
            },
            "DIG_KEY": {
                "INTERESTING": {}
            }
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {},
                "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {}
            },
            "CODEBASE_UNKNOWN": {
                "FILE_STRUCTURE_UNKNOWN": {}
            }
        },
        "PROJECT_SELECTION":{
            "FIRST_ACTION": {
                "BROWSING": {}
            },
            "RECOMMENDED": {
                "UNNOTICED": {}
            },
            "WORK_WITH_LOCAL_FILES": {}
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {},
                "POSITIVE": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            },
            "MANAGER": {
                "POSITIVE": {}
            },
            "JUNIOR_DEV": {
                "POSITIVE": {}
            },
            "SOLUTION_ARCHITECT": {
                "POSITIVE": {}
            },
            "CODER": {
                "POSITIVE": {}
            },
            "TESTER": {
                "POSITIVE": {}
            },
            "FUNCTIONAL_ANALYST": {
                "NEGATIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
                "NEED_EXPLANATION": {}
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {}
            },
            "FIXING_RATIONALE": {
                "BEING_OVERWHELMED": {}
            },
            "REFERENCE_POINT_FOR_COMPARISON": {
                "MISSING": {}
            },
            "THREAT":{
                "BAD_CODE_ON_PURPOSE": {},
                "IMPOSED_TOOL": {}
            },
            "GAMIFICATION": {
                "MISSING": {}
            },
            "MUST_KNOW_CODEBASE":{}
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {}
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {}
            },
            "FREEZE_NAME": {
                "UNCLEAR": {}
            },
            "FREEZE_KEY": {
                "HARD_RECALL": {},
                "MISSED": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "NOT_INTUITIVE": {},
                "USEFUL": {},
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
                "NOT_INTUITIVE": {},
            },
            "FILE_HOVER": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {}
            },
            "NUMERICAL_VALUES": {
                "MISSING": {}
            },
            "MONSTER_NB_TOT": {
                "INTUITIVE": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "INTUITIVE": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {},
                "NOT_INTUITIVE": {}
            },
            "MUSIC": {
                "TOO_NERVOUS": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            }
        }
    }
    ,
    #V7 (Generated from Interview #7 used for Interview #8)
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {},
                "COLORS_LINK_MISSING": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
            },
            "LEGEND_SCALE_DIRECTION": {
                "NOT_INTUITIVE": {},
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "REVERSED": {},
                "INTUITIVE": {}
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {}
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_GROUND": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {}
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_WALL": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "ONE_MEANS_HIGH_MEANING": {},
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTERS":{
                "ARE_ISSUES": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MUSIC":{
                "IS_DANGER": {}
            },
            "COLORS":{
                "GENERAL_QUALITY": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {}
            },
            "FILE_SIZE": {
                "ADD_MAPPING": {},
                "IS_SUB_DIR_SQUARE_SIZE": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "PAIR_PROGRAMMING": {}
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {},
                "TRY_BY_CURIOSITY": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
                "FLEE": {},
                "ONLY_WHEN_FEELING_ACHIEVABLE": {}
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {},
                "NOT_FOUND": {},
                "NOT_USED": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
            "CONTROLS": {
                "INTUITIVE": {}
            },
            "TASKLIST": {
                "MISSING_HIGH": {}
            },
            "DIG_KEY": {
                "INTERESTING": {}
            },
            "GO_UP_KEY": {
                "MISSED": {}
            }
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {},
                "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {}
            },
            "CODEBASE_UNKNOWN": {
                "FILE_STRUCTURE_UNKNOWN": {}
            }
        },
        "PROJECT_SELECTION":{
            "FIRST_ACTION": {
                "BROWSING": {}
            },
            "RECOMMENDED": {
                "UNNOTICED": {}
            },
            "WORK_WITH_LOCAL_FILES": {}
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {},
                "POSITIVE": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            },
            "MANAGER": {
                "MEDIUM": {},
                "POSITIVE": {}
            },
            "JUNIOR_DEV": {
                "POSITIVE": {}
            },
            "SOLUTION_ARCHITECT": {
                "POSITIVE": {}
            },
            "CODER": {
                "POSITIVE": {}
            },
            "TESTER": {
                "POSITIVE": {}
            },
            "FUNCTIONAL_ANALYST": {
                "NEGATIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
                "NEED_EXPLANATION": {}
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {}
            },
            "FIXING_RATIONALE": {
                "BEING_OVERWHELMED": {}
            },
            "REFERENCE_POINT_FOR_COMPARISON": {
                "MISSING": {}
            },
            "THREAT":{
                "BAD_CODE_ON_PURPOSE": {},
                "IMPOSED_TOOL": {}
            },
            "GAMIFICATION": {
                "MISSING": {}
            },
            "MUST_KNOW_CODEBASE":{}
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "CONTROLS_UNNOTICED": {},
                "LEAVING_EARLY": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {}
            },
            "MAP_NUMBER": {
                "EMPIRICAL_DEDUCTION": {}
            },
            "FREEZE_NAME": {
                "UNCLEAR": {}
            },
            "FREEZE_KEY": {
                "HARD_RECALL": {},
                "MISSED": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "NOT_INTUITIVE": {},
                "USEFUL": {},
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
                "NOT_INTUITIVE": {},
            },
            "FILE_HOVER": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {},
                "TO_FIGHT": {}
            },
            "MAP_SEARCH_BAR": {
                "TYPE_NAME_OF_FILE": {}
            },
            "NUMERICAL_VALUES": {
                "MISSING": {}
            },
            "MONSTER_NB_TOT": {
                "INTUITIVE": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "INTUITIVE": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {},
                "NOT_INTUITIVE": {}
            },
            "MUSIC": {
                "TOO_NERVOUS": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            },
            "PROJECT_LOADING": {
                "BORING": {}
            }
        }
    }
    ,
    #V8
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {},
                "COLORS_LINK_MISSING": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
            },
            "LEGEND_SCALE_DIRECTION": {
                "NOT_INTUITIVE": {},
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "REVERSED": {},
                "INTUITIVE": {}
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_GROUND": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {}
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_WALL": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "ONE_MEANS_HIGH_MEANING": {},
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTERS":{
                "ARE_ISSUES": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MUSIC":{
                "IS_DANGER": {}
            },
            "COLORS":{
                "GENERAL_QUALITY": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {}
            },
            "FILE_SIZE": {
                "ADD_MAPPING": {},
                "IS_SUB_DIR_SQUARE_SIZE": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "PAIR_PROGRAMMING": {}
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {},
                "TRY_BY_CURIOSITY": {},
                "EARLY_STAGE": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
                "FLEE": {},
                "ONLY_WHEN_FEELING_ACHIEVABLE": {}
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {},
                "NOT_FOUND": {},
                "NOT_USED": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
            "CONTROLS": {
                "INTUITIVE": {},
                "NOT_INTUITIVE": {}
            },
            "TASKLIST": {
                "MISSING_HIGH": {}
            },
            "DIG_KEY": {
                "INTERESTING": {}
            },
            "GO_UP_KEY": {
                "MISSED": {}
            }
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {},
                "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {},
                "NOT_INTUITIVE": {}
            },
            "TRACKPAD": {
                "BAD": {},
            },
            "CODEBASE_UNKNOWN": {
                "FILE_STRUCTURE_UNKNOWN": {}
            }
        },
        "PROJECT_SELECTION":{
            "FIRST_ACTION": {
                "BROWSING": {}
            },
            "RECOMMENDED": {
                "UNNOTICED": {}
            },
            "WORK_WITH_LOCAL_FILES": {}
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {},
                "POSITIVE": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            },
            "MANAGER": {
                "MEDIUM": {},
                "POSITIVE": {}
            },
            "JUNIOR_DEV": {
                "POSITIVE": {}
            },
            "SOLUTION_ARCHITECT": {
                "POSITIVE": {}
            },
            "CODER": {
                "POSITIVE": {}
            },
            "TESTER": {
                "POSITIVE": {}
            },
            "FUNCTIONAL_ANALYST": {
                "NEGATIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
                "NEED_EXPLANATION": {}
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {}
            },
            "FIXING_RATIONALE": {
                "BEING_OVERWHELMED": {}
            },
            "REFERENCE_POINT_FOR_COMPARISON": {
                "MISSING": {}
            },
            "THREAT":{
                "BAD_CODE_ON_PURPOSE": {},
                "IMPOSED_TOOL": {}
            },
            "GAMIFICATION": {
                "MISSING": {}
            },
            "MUST_KNOW_CODEBASE":{}
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "CONTROLS_UNNOTICED": {},
                "LEAVING_EARLY": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
                "NOT_INTUITIVE": {}
            },
            "MAP_NUMBER": {
                "EMPIRICAL_DEDUCTION": {}
            },
            "FREEZE_NAME": {
                "UNCLEAR": {}
            },
            "FREEZE_KEY": {
                "HARD_RECALL": {},
                "MISSED": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {},
                "NOT_INTUITIVE": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "NOT_INTUITIVE": {},
                "USEFUL": {},
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
                "NOT_INTUITIVE": {},
            },
            "FILE_HOVER": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {},
                "TO_FIGHT": {}
            },
            "MAP_SEARCH_BAR": {
                "TYPE_NAME_OF_FILE": {}
            },
            "NUMERICAL_VALUES": {
                "MISSING": {}
            },
            "MONSTER_NB_TOT": {
                "INTUITIVE": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "INTUITIVE": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {},
                "NOT_INTUITIVE": {}
            },
            "MUSIC": {
                "TOO_NERVOUS": {},
                "NEEDS_CUSTOMIZATION": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            },
            "PROJECT_LOADING": {
                "BORING": {}
            },
            "BUG": {
                "OUT_OF_MAP": {}
            }
        }
    }
    ,
    #V9
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {},
                "COLORS_LINK_MISSING": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
            },
            "LEGEND_SCALE_DIRECTION": {
                "NOT_INTUITIVE": {},
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "REVERSED": {},
                "INTUITIVE": {}
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_GROUND": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {}
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_WALL": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "ONE_MEANS_HIGH_MEANING": {},
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTERS":{
                "ARE_ISSUES": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MUSIC":{
                "IS_DANGER": {}
            },
            "COLORS":{
                "GENERAL_QUALITY": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {}
            },
            "FILE_SIZE": {
                "ADD_MAPPING": {},
                "IS_SUB_DIR_SQUARE_SIZE": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "PAIR_PROGRAMMING": {},
                "ASSIGNMENT_MARKING": {},
                "TEACH": {}
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {},
                "TRY_BY_CURIOSITY": {},
                "EARLY_STAGE": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
                "DETAILS_HARD_TO_ACCESS": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
                "FLEE": {},
                "ONLY_WHEN_FEELING_ACHIEVABLE": {},
                "FORCES_DIGGING": {},
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {},
                "NOT_FOUND": {},
                "NOT_USED": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
            "CONTROLS": {
                "INTUITIVE": {},
                "NOT_INTUITIVE": {}
            },
            "TASKLIST": {
                "MISSING_HIGH": {}
            },
            "DIG_KEY": {
                "INTERESTING": {},
                "INTUITIVE": {},
                "NOT_INTUITIVE": {}
            },
            "GO_UP_KEY": {
                "MISSED": {}
            },
            "SONARCLOUD_INTEGRATION": {
                "MISSING": {}
            },
            "GAME_WINDOW": {
                "SMALL": {}
            }
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {},
                "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {},
                "NOT_INTUITIVE": {}
            },
            "TRACKPAD": {
                "BAD": {},
            },
            "CODEBASE_UNKNOWN": {
                "FILE_STRUCTURE_UNKNOWN": {}
            }
        },
        "PROJECT_SELECTION":{
            "FIRST_ACTION": {
                "BROWSING": {}
            },
            "RECOMMENDED": {
                "UNNOTICED": {}
            },
            "WORK_WITH_LOCAL_FILES": {}
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
                "CLASSIC_VIS_MORE_COMPLETE": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {},
                "POSITIVE": {},
                "LOW": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            },
            "MANAGER": {
                "MEDIUM": {},
                "POSITIVE": {}
            },
            "JUNIOR_DEV": {
                "POSITIVE": {}
            },
            "SOLUTION_ARCHITECT": {
                "POSITIVE": {}
            },
            "CODER": {
                "POSITIVE": {}
            },
            "TESTER": {
                "POSITIVE": {}
            },
            "FUNCTIONAL_ANALYST": {
                "NEGATIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
                "NEED_EXPLANATION": {}
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {}
            },
            "FIXING_RATIONALE": {
                "BEING_OVERWHELMED": {}
            },
            "REQUIREMENT": {
                "BIG_PROJECT": {}
            },
            "REFERENCE_POINT_FOR_COMPARISON": {
                "MISSING": {}
            },
            "THREAT":{
                "BAD_CODE_ON_PURPOSE": {},
                "IMPOSED_TOOL": {}
            },
            "GAMIFICATION": {
                "MISSING": {}
            },
            "MUST_KNOW_CODEBASE":{}
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "CONTROLS_UNNOTICED": {},
                "LEAVING_EARLY": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
                "NOT_INTUITIVE": {}
            },
            "MAP_NUMBER": {
                "EMPIRICAL_DEDUCTION": {}
            },
            "FREEZE_NAME": {
                "UNCLEAR": {}
            },
            "FREEZE_KEY": {
                "HARD_RECALL": {},
                "MISSED": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {},
                "NOT_INTUITIVE": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "NOT_INTUITIVE": {},
                "USEFUL": {},
                "INTUITIVE": {},
                "USEFUL": {},
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
                "NOT_INTUITIVE": {},
            },
            "FILE_HOVER": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {},
                "TO_FIGHT": {}
            },
            "MAP_SEARCH_BAR": {
                "TYPE_NAME_OF_FILE": {}
            },
            "NUMERICAL_VALUES": {
                "MISSING": {}
            },
            "MONSTER_NB_TOT": {
                "INTUITIVE": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "INTUITIVE": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {},
                "NOT_INTUITIVE": {}
            },
            "MUSIC": {
                "TOO_NERVOUS": {},
                "NEEDS_CUSTOMIZATION": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            },
            "PROJECT_LOADING": {
                "BORING": {}
            },
            "BUG": {
                "OUT_OF_MAP": {}
            },
            "ISSUE_ACCESS": {
                "SLOW_LOADING": {},
            }
        }
    }
    ,
]

datasRevisedManually = {
    "MAPPING":{
        "MAP": {
            "PACKAGE_STRUCTURE": {},
            "COLORS_LINK_MISSING": {}
        },
        "COMBAT": {
            "NO_LESSON": {},
            "OVERWHELMING_IS_BAD_CODE": {},
            "CLEANABLE_IS_MANAGEABLE": {}
        },
        "ROOM": {
            "PACKAGE_STRUCTURE": {},
            "VULN_SOURCE_IN_LEAF": {},
            "NOT_INTUITIVE": {},
        },
        "FUNKY":{
            "EMPIRICAL_DEDUCTION": {},
            "LEFT_TO_RIGHT": {},
            "INTUITIVE": {},
            "WANT_REVERSED": {},
        },
        "RAINBOW":{
            "LEFT_TO_RIGHT": {},
        },
        "SECURITY_METRIC": {
            "IS_CLASS_VISIBILITY": {},
            "IS_COLORS": {},
            "IS_SMELL_VOLATILITY": {},
            "NOTICED": {},
            "HARD_RECALL": {},
            "NOT_INTUITIVE": {},
        },
        "MAINTAINABILITY_METRIC": {
            "CONFUSING": {},
            "CRACKS_NOT_FOUND": {},
            "NOT_INTUITIVE": {},
        },
        "RELIABILITY_METRIC": {
            "IS_REPLICABILITY": {},
            "NOTICED": {},
            "HARD_RECALL": {},
            "NOT_INTUITIVE": {},
        },
        "BUGS": {
            "HARD_RECALL": {},
            "NOTICED": {},
            "IS_GROUND": {},
        },
        "CODE_SMELLS": {
            "HARD_RECALL": {},
            "NOTICED": {}
        },
        "VULNS": {
            "HARD_RECALL": {},
            "NOTICED": {},
            "IS_WALL": {}
        },
        "FILE_TYPE": {
            "ADD_MAPPING": {},
        },
        "MONSTER_SIZE": {
            "NOT_INTUITIVE": {},
            "INTUITIVE": {}
        },
        "MONSTER_NUMBER": {
            "SUM_SUBDIRECTORIES": {},
            "INTUITIVE": {},
        },
        "MONSTERS":{
            "ARE_ISSUES": {},
            "NOT_INTUITIVE": {},
            "INTUITIVE": {}
        },
        "MUSIC":{
            "IS_DANGER": {}
        },
        "COLORS":{
            "GENERAL_QUALITY": {},
            "NOT_INTUITIVE": {},
            "ADD_DIFFERENT_COLORS_PER_PURPOSE": {}
        },
        "FILE_SIZE": {
            "ADD_MAPPING": {},
            "IS_SUB_DIR_SQUARE_SIZE": {}
        },
        "DATA_LEAK": {},
        "NO_CODE_NO_ISSUES": {},
        "PERFECT_ROOM_PERFECT_CODE": {}
    },
    "USAGE":{
        "SCENARIO": {
            "CHECK_EVOLUTION": {},
            "COMMUNICATION": {},
            "DEBT_FIGHT_ENGAGEMENT": {},
            "PEOPLE_PERFORMANCE_TRACKING": {},
            "MONITOR_DEBT": {},
            "MANAGEMENT": {},
            "PAIR_PROGRAMMING": {},
            "ASSIGNMENT_MARKING": {},
            "TASK_LIST": {},
            "TEACH": {},
            "COMPLEMENTS_CLASSIC_VIS": {},
        },
        "FREQUENCY": {
            "AGILE": {},
            "RELEASE": {},
            "1_WEEK": {},
            "DAY_TO_DAY": {},
            "TRY_BY_CURIOSITY": {},
            "EARLY_STAGE": {}
        },
        "DILEMMA": {
            "ISSUE": {}
        },
        "THREAT": {
            "BOSS_AGAINST": {}
        },
        "DILEMMA_GAME": {
            "LESS_INFORMATIVE": {},
            "DISTURBING": {}
        },
        "DILEMMA_TOOL": {
            "MORE_INFORMATIVE": {},
            "IT_IS": {},
            "MISSING_INFORMATION": {},
            "DETAILS_HARD_TO_ACCESS": {}
        }
    },
    "GAMEPLAY":{
        "COMBAT_DIVERSITY": {
            "LOW": {}
        },
        "COMBAT": {
            "PACE_OVERWHELMING": {},
            "OBLITERATION_DESIRED": {},
            "INTUITIVE": {},
            "SIMPLE": {},
            "FLEE": {},
            "ONLY_WHEN_FEELING_ACHIEVABLE": {},
            "FORCES_DIGGING": {},
        },
        "ATTACK_SPEED": {
            "LOW": {}
        },
        "DAMAGE_DEALT": {
            "LOW": {}
        },
        "PLAYER_UPGRADES": {
            "LACKING": {}
        },
        "MAP": {
            "USABILITY_GOOD": {},
            "USABILITY_BAD": {},
            "NOT_FOUND": {}
        },
        "LOG_BOOK": {
            "MISSING_LOW": {}
        },
        "MINIMAP": {
            "MISSING_HIGH": {}
        },
        "INSTANT_FEEDBACK_FIXING": {
            "MISSING_DOUBT": {},
            "MISSING": {},
            "NEED_SCORE": {}
        },
        "MONSTER_RESPAWN": {
            "NOT_INTUITIVE": {}
        },
        "CONTROLS": {
            "INTUITIVE": {},
            "NOT_INTUITIVE": {},
            "SPAM_ATTACK": {}
        },
        "TASKLIST": {
            "MISSING_HIGH": {}
        },
        "DIG_KEY": {
            "INTUITIVE": {},
        },
        "GO_UP_KEY": {
            "MISSED": {}
        },
        "SONARCLOUD_INTEGRATION": {
            "MISSING": {}
        },
        "GAME_WINDOW": {
            "SMALL": {}
        },
        "FILE_EDITION": {
            "EXPECTED": {},
        }
    },
    "NAVIGATION":{
        "EXPLORING": {
            "HARD_WHEN_MONSTERS": {},
            "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}
        },
        "MOUSE": {
            "NOT_FOUND": {},
            "USEFUL": {},
            "NOT_INTUITIVE": {},
            "NOT_USED": {},
        },
        "TRACKPAD": {
            "BAD": {},
        },
        "DIG_GO_UP": {
            "INTERESTING": {},
            "NOT_INTUITIVE": {},
        },
        "CODEBASE_UNKNOWN": {
            "FILE_STRUCTURE_UNKNOWN": {}
        }
    },
    "PROJECT_SELECTION":{
        "FIRST_ACTION": {
            "BROWSING": {}
        },
        "RECOMMENDED": {
            "UNNOTICED": {}
        },
        "WORK_WITH_LOCAL_FILES": {}
    },
    "TARGET_USER":{
        "ME": {
            "POSITIVE": {},
            "MEDIUM": {},
            "NEGATIVE": {},
            "CLASSIC_VIS_EASIER": {},
            "GAME_VIS_FUNNIER": {},
            "CLASSIC_VIS_MORE_COMPLETE": {}
        },
        "STUDENTS": {
            "POSITIVE": {}
        },
        "TEACHERS": {
            "POSITIVE": {}
        },
        "TEAM": {
            "POSITIVE": {}
        },
        "STRONG_INDIVIDUALS": {
            "NEGATIVE": {}
        },
        "DEV": {
            "MEDIUM": {},
            "POSITIVE": {},
            "LOW": {}
        },
        "GAME_DEV": {
            "POSITIVE": {}
        },
        "MANAGER": {
            "MEDIUM": {},
            "POSITIVE": {}
        },
        "JUNIOR_DEV": {
            "POSITIVE": {}
        },
        "SOLUTION_ARCHITECT": {
            "POSITIVE": {}
        },
        "CODER": {
            "POSITIVE": {}
        },
        "TESTER": {
            "POSITIVE": {}
        },
        "FUNCTIONAL_ANALYST": {
            "NEGATIVE": {}
        },
        "UX_DESIGNER": {
            "POSITIVE": {}
        }
    },
    "ENGAGEMENT":{
        "USER_AGENCY": {
            "LACKING": {}
        },
        "GOAL": {
            "LACKING": {},
            "FIND_WORSE_FILE": {},
            "FUN": {},
            "COULD_BE_AN_OUTLET": {},
            "SUMMARY": {},
            "IMPLICIT_FEEDBACK": {},
            "SATISFYING": {},
            "CONFUSING": {},
        },
        "FIXING": {
            "POSITIVE": {},
            "NEGATIVE": {},
            "PRIORITIZATION_REQUIRED": {},
            "FOR_MY_PROJECT": {}
        },
        "FIXING_RATIONALE": {
            "BEING_OVERWHELMED": {}
        },
        "REQUIREMENT": {
            "BIG_PROJECT": {}
        },
        "REFERENCE_POINT_FOR_COMPARISON": {
            "MISSING": {}
        },
        "THREAT":{
            "BAD_CODE_ON_PURPOSE": {},
            "IMPOSED_TOOL": {}
        },
        "GAMIFICATION": {
            "MISSING": {}
        },
        "MUST_KNOW_CODEBASE":{}
    },
    "INFORMATION":{
        "TUTORIAL": {
            "RIGHT_INFORMATION": {},
            "MISSING_TILE_INFORMATION": {},
            "MISSING_CONTEXT_INFORMATION": {},
            "CONTROLS_UNNOTICED": {},
            "LEAVING_EARLY": {},
            "CLICK_ON_MONSTER": {},
        },
        "ROOM_INFORMATION": {
            "OVERWHELMING": {},
            "NOT_INTUITIVE": {},
            "INTUITIVE": {},
        },
        "SUB_FOLDER_NAME": {
            "UNKNOWN": {}
        },
        "ROOM_CLEANED_NOTIFICATION": {
            "MISSING": {},
            "INTERPRETATION_ISSUE": {}
        },
        "TILE_NUMBER": {
            "CONFUSING": {},
            "EMPIRICAL_DEDUCTION": {},
            "INTUITIVE": {},
            "CONFUSING_COMPARABILITY": {},
            "NOT_INTUITIVE": {}
        },
        "MAP_NUMBER": {
            "EMPIRICAL_DEDUCTION": {}
        },
        "FREEZE_NAME": {
            "UNCLEAR": {}
        },
        "FREEZE_KEY": {
            "HARD_RECALL": {},
            "MISSED": {}
        },
        "FREEZE_INFORMATION": {
            "DEVY": {},
            "USEFUL": {},
            "OVERWHELMING": {},
            "INTUITIVE": {},
            "SUB_DIR_MISSING": {},
            "NOT_INTUITIVE": {}
        },
        "ISSUE_ACCESS": {
            "COOL": {},
            "USEFUL": {},
            "INTUITIVE": {},
            "USEFUL": {},
            "NOT_USED": {},
            "NOT_ON_PURPOSE": {},
            "NOT_FOUND": {}
        },
        "LEARNING_CURVE": {
            "MEDIUM": {},
        },
        "FILE_NAME_INDICATOR": {
            "DISCRETE": {},
            "NOTICED": {},
            "NOT_INTUITIVE": {},
        },
        "FILE_HOVER": {
            "INTUITIVE": {},
            "USEFUL": {},
            "NOT_USED": {},
            "NOT_FOUND": {},
        },
        "FREEZE_FREEZE": {
            "USEFUL_TO_LOOK_AROUND": {},
            "MISSED": {},
            "FOUND": {},
            "TO_FIGHT": {}
        },
        "MAP_SEARCH_BAR": {
            "TYPE_NAME_OF_FILE": {},
            "NOT_USED": {},
        },
        "NUMERICAL_VALUES": {
            "MISSING": {}
        },
        "MONSTER_NB_TOT": {
            "INTUITIVE": {}
        }
    },
    "ART":{
        "CHARACTER": {
            "CONTRAST_WELL": {}
        },
        "RAINBOW": {
            "GOOD": {},
            "INTUITIVE": {}
        },
        "GAME_LAYOUT": {
            "GOOD": {}
        },
        "ANIMATION": {
            "GOOD": {}
        },
        "FUNKY": {
            "BAD": {},
            "NOT_INTUITIVE": {}
        },
        "MUSIC": {
            "TOO_NERVOUS": {},
            "NEEDS_CUSTOMIZATION": {}
        },
        "VOLUME": {
            "TOO_LOUD": {},
            "NOT_MODIFIABLE": {}
        },
        "ENEMY_TYPE": {
            "DIFFERENTIABLE": {}
        },
    },
    "PERFORMANCE":{
        "LAG": {
            "NOTICED": {},
            "SOLUTION_LIMIT_SPAWN": {}
        },
        "PROJECT_LOADING": {
            "BORING": {}
        },
        "BUG": {
            "OUT_OF_MAP": {}
        },
        "ISSUE_ACCESS": {
            "SLOW_LOADING": {},
        }
    }
}


datas = [
    {},
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}},
            "COMBAT": {"NO_LESSON": {}, "CLEANABLE_IS_MANAGEABLE": {}},
            "ROOM": {"PACKAGE_STRUCTURE": {}},
            "FUNKY": {"EMPIRICAL_DEDUCTION": {}, "LEFT_TO_RIGHT": {}},
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
            },
            "MAINTAINABILITY_METRIC": {"CONFUSING": {}, "CRACKS_NOT_FOUND": {}},
            "RELIABILITY_METRIC": {"IS_REPLICABILITY": {}},
            "CODE_SMELLS": {"NOTICED": {}},
            "VULNS": {"NOTICED": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {"CHECK_EVOLUTION": {}, "MONITOR_DEBT": {}, "TEACH": {}},
            "FREQUENCY": {"AGILE": {}, "RELEASE": {}},
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {"MORE_INFORMATIVE": {}, "IT_IS": {}},
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {"PACE_OVERWHELMING": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
        },
        "NAVIGATION": {"MOUSE": {"NOT_USED": {}}},
        "TARGET_USER": {
            "ME": {"POSITIVE": {}},
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "DEV": {"MEDIUM": {}},
            "GAME_DEV": {"POSITIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {"LACKING": {}},
            "FIXING": {"POSITIVE": {}},
        },
        "INFORMATION": {
            "TUTORIAL": {"RIGHT_INFORMATION": {}, "MISSING_CONTEXT_INFORMATION": {}},
            "ROOM_INFORMATION": {"OVERWHELMING": {}, "NOT_INTUITIVE": {}},
            "ROOM_CLEANED_NOTIFICATION": {"MISSING": {}, "INTERPRETATION_ISSUE": {}},
            "TILE_NUMBER": {"CONFUSING": {}},
            "FREEZE_INFORMATION": {"DEVY": {}, "USEFUL": {}, "OVERWHELMING": {}},
            "ISSUE_ACCESS": {"NOT_USED": {}},
            "FILE_HOVER": {"NOT_USED": {}},
            "MAP_SEARCH_BAR": {"NOT_USED": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
        },
        "PERFORMANCE": {"LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}}},
    },
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}},
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {},
            },
            "ROOM": {"PACKAGE_STRUCTURE": {}},
            "FUNKY": {"EMPIRICAL_DEDUCTION": {}, "LEFT_TO_RIGHT": {}},
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "MAINTAINABILITY_METRIC": {"CONFUSING": {}, "CRACKS_NOT_FOUND": {}},
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "BUGS": {"HARD_RECALL": {}, "NOTICED": {}},
            "CODE_SMELLS": {"HARD_RECALL": {}, "NOTICED": {}},
            "VULNS": {"HARD_RECALL": {}, "NOTICED": {}},
            "FILE_TYPE": {"ADD_MAPPING": {}},
            "MONSTER_SIZE": {"NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MONSTER_NUMBER": {"SUM_SUBDIRECTORIES": {}},
            "MONSTERS": {"ARE_ISSUES": {}, "INTUITIVE": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "TEACH": {},
            },
            "FREQUENCY": {"AGILE": {}, "RELEASE": {}},
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {"MORE_INFORMATIVE": {}, "IT_IS": {}},
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {"PACE_OVERWHELMING": {}},
            "ATTACK_SPEED": {"LOW": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}, "NOT_FOUND": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
            "INSTANT_FEEDBACK_FIXING": {"MISSING_DOUBT": {}, "MISSING": {}},
            "MONSTER_RESPAWN": {"NOT_INTUITIVE": {}},
        },
        "NAVIGATION": {
            "EXPLORING": {"HARD_WHEN_MONSTERS": {}},
            "MOUSE": {"NOT_USED": {}},
        },
        "TARGET_USER": {
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
            },
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "TEAM": {"POSITIVE": {}},
            "STRONG_INDIVIDUALS": {"NEGATIVE": {}},
            "DEV": {"MEDIUM": {}},
            "GAME_DEV": {"POSITIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {"LACKING": {}},
            "FIXING": {"POSITIVE": {}, "NEGATIVE": {}, "PRIORITIZATION_REQUIRED": {}},
        },
        "INFORMATION": {
            "TUTORIAL": {"RIGHT_INFORMATION": {}, "MISSING_CONTEXT_INFORMATION": {}},
            "ROOM_INFORMATION": {"OVERWHELMING": {}, "NOT_INTUITIVE": {}},
            "SUB_FOLDER_NAME": {"UNKNOWN": {}},
            "ROOM_CLEANED_NOTIFICATION": {"MISSING": {}, "INTERPRETATION_ISSUE": {}},
            "TILE_NUMBER": {"CONFUSING": {}},
            "FREEZE_INFORMATION": {"DEVY": {}, "USEFUL": {}, "OVERWHELMING": {}},
            "ISSUE_ACCESS": {"COOL": {}, "USEFUL": {}, "NOT_USED": {}, "NOT_FOUND": {}},
            "LEARNING_CURVE": {"MEDIUM": {}},
            "FILE_NAME_INDICATOR": {"DISCRETE": {}, "NOTICED": {}},
            "FILE_HOVER": {"NOT_USED": {}},
            "MAP_SEARCH_BAR": {"NOT_USED": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}, "INTUITIVE": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
            "VOLUME": {"TOO_LOUD": {}, "NOT_MODIFIABLE": {}},
            "ENEMY_TYPE": {"DIFFERENTIABLE": {}},
        },
        "PERFORMANCE": {"LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}}},
    },
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}},
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {},
            },
            "ROOM": {"PACKAGE_STRUCTURE": {}},
            "FUNKY": {"EMPIRICAL_DEDUCTION": {}, "LEFT_TO_RIGHT": {}},
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "MAINTAINABILITY_METRIC": {"CONFUSING": {}, "CRACKS_NOT_FOUND": {}},
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "BUGS": {"HARD_RECALL": {}, "NOTICED": {}},
            "CODE_SMELLS": {"HARD_RECALL": {}, "NOTICED": {}},
            "VULNS": {"HARD_RECALL": {}, "NOTICED": {}},
            "FILE_TYPE": {"ADD_MAPPING": {}},
            "MONSTER_SIZE": {"NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MONSTER_NUMBER": {"SUM_SUBDIRECTORIES": {}, "INTUITIVE": {}},
            "MONSTERS": {"ARE_ISSUES": {}, "INTUITIVE": {}},
            "MUSIC": {"IS_DANGER": {}},
            "COLORS": {"GENERAL_QUALITY": {}, "NOT_INTUITIVE": {}},
            "FILE_SIZE": {"ADD_MAPPING": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "TEACH": {},
            },
            "FREQUENCY": {"AGILE": {}, "RELEASE": {}, "1_WEEK": {}},
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
            },
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {"PACE_OVERWHELMING": {}, "OBLITERATION_DESIRED": {}},
            "ATTACK_SPEED": {"LOW": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}, "NOT_FOUND": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
            "INSTANT_FEEDBACK_FIXING": {"MISSING_DOUBT": {}, "MISSING": {}},
            "MONSTER_RESPAWN": {"NOT_INTUITIVE": {}},
        },
        "NAVIGATION": {
            "EXPLORING": {"HARD_WHEN_MONSTERS": {}},
            "MOUSE": {"NOT_FOUND": {}, "USEFUL": {}, "NOT_USED": {}},
            "DIG_GO_UP": {"INTERESTING": {}},
            "CODEBASE_UNKNOWN": {"FILE_STRUCTURE_UNKNOWN": {}},
        },
        "PROJECT_SELECTION": {
            "FIRST_ACTION": {"BROWSING": {}},
            "RECOMMENDED": {"UNNOTICED": {}},
        },
        "TARGET_USER": {
            "ME": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
            },
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "TEAM": {"POSITIVE": {}},
            "STRONG_INDIVIDUALS": {"NEGATIVE": {}},
            "DEV": {"MEDIUM": {}},
            "GAME_DEV": {"POSITIVE": {}},
            "MANAGER": {"POSITIVE": {}},
            "JUNIOR_DEV": {"POSITIVE": {}},
            "CODER": {"POSITIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {},
            },
            "REQUIREMENT": {"BIG_PROJECT": {}},
            "THREAT": {"BAD_CODE_ON_PURPOSE": {}},
        },
        "INFORMATION": {
            "TUTORIAL": {"RIGHT_INFORMATION": {}, "MISSING_CONTEXT_INFORMATION": {}},
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {"UNKNOWN": {}},
            "ROOM_CLEANED_NOTIFICATION": {"MISSING": {}, "INTERPRETATION_ISSUE": {}},
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "CONFUSING_COMPARABILITY": {},
            },
            "FREEZE_NAME": {"UNCLEAR": {}},
            "FREEZE_KEY": {"HARD_RECALL": {}},
            "FREEZE_INFORMATION": {"DEVY": {}, "USEFUL": {}, "OVERWHELMING": {}},
            "ISSUE_ACCESS": {"COOL": {}, "USEFUL": {}, "NOT_USED": {}, "NOT_FOUND": {}},
            "LEARNING_CURVE": {"MEDIUM": {}},
            "FILE_NAME_INDICATOR": {"DISCRETE": {}, "NOTICED": {}},
            "FILE_HOVER": {"USEFUL": {}, "NOT_USED": {}, "NOT_FOUND": {}},
            "FREEZE_FREEZE": {"USEFUL_TO_LOOK_AROUND": {}},
            "MAP_SEARCH_BAR": {"NOT_USED": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}, "INTUITIVE": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
            "VOLUME": {"TOO_LOUD": {}, "NOT_MODIFIABLE": {}},
            "ENEMY_TYPE": {"DIFFERENTIABLE": {}},
        },
        "PERFORMANCE": {"LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}}},
    },
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}},
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "FUNKY": {
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
                "WANT_REVERSED": {},
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "MAINTAINABILITY_METRIC": {"CONFUSING": {}, "CRACKS_NOT_FOUND": {}},
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "BUGS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_GROUND": {}},
            "CODE_SMELLS": {"HARD_RECALL": {}, "NOTICED": {}},
            "VULNS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_WALL": {}},
            "FILE_TYPE": {"ADD_MAPPING": {}},
            "MONSTER_SIZE": {"NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MONSTER_NUMBER": {"SUM_SUBDIRECTORIES": {}, "INTUITIVE": {}},
            "MONSTERS": {"ARE_ISSUES": {}, "NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MUSIC": {"IS_DANGER": {}},
            "COLORS": {
                "GENERAL_QUALITY": {},
                "NOT_INTUITIVE": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {},
            },
            "FILE_SIZE": {"ADD_MAPPING": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "TASK_LIST": {},
                "TEACH": {},
            },
            "FREQUENCY": {"AGILE": {}, "RELEASE": {}, "1_WEEK": {}, "DAY_TO_DAY": {}},
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
            },
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "SIMPLE": {},
            },
            "ATTACK_SPEED": {"LOW": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}, "NOT_FOUND": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
            "INSTANT_FEEDBACK_FIXING": {"MISSING_DOUBT": {}, "MISSING": {}},
            "MONSTER_RESPAWN": {"NOT_INTUITIVE": {}},
            "CONTROLS": {"INTUITIVE": {}},
            "TASKLIST": {"MISSING_HIGH": {}},
        },
        "NAVIGATION": {
            "EXPLORING": {"HARD_WHEN_MONSTERS": {}},
            "MOUSE": {"NOT_FOUND": {}, "USEFUL": {}, "NOT_USED": {}},
            "DIG_GO_UP": {"INTERESTING": {}},
            "CODEBASE_UNKNOWN": {"FILE_STRUCTURE_UNKNOWN": {}},
        },
        "PROJECT_SELECTION": {
            "FIRST_ACTION": {"BROWSING": {}},
            "RECOMMENDED": {"UNNOTICED": {}},
            "WORK_WITH_LOCAL_FILES": {},
        },
        "TARGET_USER": {
            "ME": {
                "POSITIVE": {},
                "MEDIUM": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
            },
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "TEAM": {"POSITIVE": {}},
            "STRONG_INDIVIDUALS": {"NEGATIVE": {}},
            "DEV": {"MEDIUM": {}},
            "GAME_DEV": {"POSITIVE": {}},
            "MANAGER": {"POSITIVE": {}},
            "JUNIOR_DEV": {"POSITIVE": {}},
            "SOLUTION_ARCHITECT": {"POSITIVE": {}},
            "CODER": {"POSITIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {},
            },
            "REQUIREMENT": {"BIG_PROJECT": {}},
            "THREAT": {"BAD_CODE_ON_PURPOSE": {}},
        },
        "INFORMATION": {
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "MISSING_CONTEXT_INFORMATION": {},
                "LEAVING_EARLY": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {"UNKNOWN": {}},
            "ROOM_CLEANED_NOTIFICATION": {"MISSING": {}, "INTERPRETATION_ISSUE": {}},
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
            },
            "FREEZE_NAME": {"UNCLEAR": {}},
            "FREEZE_KEY": {"HARD_RECALL": {}, "MISSED": {}},
            "FREEZE_INFORMATION": {"DEVY": {}, "USEFUL": {}, "OVERWHELMING": {}},
            "ISSUE_ACCESS": {"COOL": {}, "USEFUL": {}, "NOT_USED": {}, "NOT_FOUND": {}},
            "LEARNING_CURVE": {"MEDIUM": {}},
            "FILE_NAME_INDICATOR": {"DISCRETE": {}, "NOTICED": {}, "NOT_INTUITIVE": {}},
            "FILE_HOVER": {
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_FOUND": {},
            },
            "FREEZE_FREEZE": {"USEFUL_TO_LOOK_AROUND": {}},
            "MAP_SEARCH_BAR": {"NOT_USED": {}},
            "NUMERICAL_VALUES": {"MISSING": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}, "INTUITIVE": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
            "MUSIC": {"TOO_NERVOUS": {}},
            "VOLUME": {"TOO_LOUD": {}, "NOT_MODIFIABLE": {}},
            "ENEMY_TYPE": {"DIFFERENTIABLE": {}},
        },
        "PERFORMANCE": {"LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}}},
    },
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}, "COLORS_LINK_MISSING": {}},
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "FUNKY": {
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
                "WANT_REVERSED": {},
            },
            "RAINBOW": {"LEFT_TO_RIGHT": {}},
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "MAINTAINABILITY_METRIC": {"CONFUSING": {}, "CRACKS_NOT_FOUND": {}},
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
            },
            "BUGS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_GROUND": {}},
            "CODE_SMELLS": {"HARD_RECALL": {}, "NOTICED": {}},
            "VULNS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_WALL": {}},
            "FILE_TYPE": {"ADD_MAPPING": {}},
            "MONSTER_SIZE": {"NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MONSTER_NUMBER": {"SUM_SUBDIRECTORIES": {}, "INTUITIVE": {}},
            "MONSTERS": {"ARE_ISSUES": {}, "NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MUSIC": {"IS_DANGER": {}},
            "COLORS": {
                "GENERAL_QUALITY": {},
                "NOT_INTUITIVE": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {},
            },
            "FILE_SIZE": {"ADD_MAPPING": {}, "IS_SUB_DIR_SQUARE_SIZE": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "TASK_LIST": {},
                "TEACH": {},
            },
            "FREQUENCY": {"AGILE": {}, "RELEASE": {}, "1_WEEK": {}, "DAY_TO_DAY": {}},
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
            },
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
            },
            "ATTACK_SPEED": {"LOW": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}, "NOT_FOUND": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
            "INSTANT_FEEDBACK_FIXING": {"MISSING_DOUBT": {}, "MISSING": {}},
            "MONSTER_RESPAWN": {"NOT_INTUITIVE": {}},
            "CONTROLS": {"INTUITIVE": {}},
            "TASKLIST": {"MISSING_HIGH": {}},
        },
        "NAVIGATION": {
            "EXPLORING": {"HARD_WHEN_MONSTERS": {}, "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}},
            "MOUSE": {"NOT_FOUND": {}, "USEFUL": {}, "NOT_USED": {}},
            "DIG_GO_UP": {"INTERESTING": {}},
            "CODEBASE_UNKNOWN": {"FILE_STRUCTURE_UNKNOWN": {}},
        },
        "PROJECT_SELECTION": {
            "FIRST_ACTION": {"BROWSING": {}},
            "RECOMMENDED": {"UNNOTICED": {}},
            "WORK_WITH_LOCAL_FILES": {},
        },
        "TARGET_USER": {
            "ME": {
                "POSITIVE": {},
                "MEDIUM": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
            },
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "TEAM": {"POSITIVE": {}},
            "STRONG_INDIVIDUALS": {"NEGATIVE": {}},
            "DEV": {"MEDIUM": {}, "POSITIVE": {}},
            "GAME_DEV": {"POSITIVE": {}},
            "MANAGER": {"POSITIVE": {}},
            "JUNIOR_DEV": {"POSITIVE": {}},
            "SOLUTION_ARCHITECT": {"POSITIVE": {}},
            "CODER": {"POSITIVE": {}},
            "TESTER": {"POSITIVE": {}},
            "FUNCTIONAL_ANALYST": {"NEGATIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {},
            },
            "FIXING_RATIONALE": {"BEING_OVERWHELMED": {}},
            "REQUIREMENT": {"BIG_PROJECT": {}},
            "REFERENCE_POINT_FOR_COMPARISON": {"MISSING": {}},
            "THREAT": {"BAD_CODE_ON_PURPOSE": {}},
            "MUST_KNOW_CODEBASE": {},
        },
        "INFORMATION": {
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "MISSING_CONTEXT_INFORMATION": {},
                "LEAVING_EARLY": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {"UNKNOWN": {}},
            "ROOM_CLEANED_NOTIFICATION": {"MISSING": {}, "INTERPRETATION_ISSUE": {}},
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
            },
            "FREEZE_NAME": {"UNCLEAR": {}},
            "FREEZE_KEY": {"HARD_RECALL": {}, "MISSED": {}},
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
            },
            "ISSUE_ACCESS": {"COOL": {}, "USEFUL": {}, "NOT_USED": {}, "NOT_FOUND": {}},
            "LEARNING_CURVE": {"MEDIUM": {}},
            "FILE_NAME_INDICATOR": {"DISCRETE": {}, "NOTICED": {}, "NOT_INTUITIVE": {}},
            "FILE_HOVER": {
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_FOUND": {},
            },
            "FREEZE_FREEZE": {"USEFUL_TO_LOOK_AROUND": {}, "MISSED": {}},
            "MAP_SEARCH_BAR": {"NOT_USED": {}},
            "NUMERICAL_VALUES": {"MISSING": {}},
            "MONSTER_NB_TOT": {"INTUITIVE": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}, "INTUITIVE": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
            "MUSIC": {"TOO_NERVOUS": {}},
            "VOLUME": {"TOO_LOUD": {}, "NOT_MODIFIABLE": {}},
            "ENEMY_TYPE": {"DIFFERENTIABLE": {}},
        },
        "PERFORMANCE": {"LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}}},
    },
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}, "COLORS_LINK_MISSING": {}},
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "FUNKY": {
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
                "WANT_REVERSED": {},
            },
            "RAINBOW": {"LEFT_TO_RIGHT": {}},
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_GROUND": {}},
            "CODE_SMELLS": {"HARD_RECALL": {}, "NOTICED": {}},
            "VULNS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_WALL": {}},
            "FILE_TYPE": {"ADD_MAPPING": {}},
            "MONSTER_SIZE": {"NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MONSTER_NUMBER": {"SUM_SUBDIRECTORIES": {}, "INTUITIVE": {}},
            "MONSTERS": {"ARE_ISSUES": {}, "NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MUSIC": {"IS_DANGER": {}},
            "COLORS": {
                "GENERAL_QUALITY": {},
                "NOT_INTUITIVE": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {},
            },
            "FILE_SIZE": {"ADD_MAPPING": {}, "IS_SUB_DIR_SQUARE_SIZE": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "TASK_LIST": {},
                "TEACH": {},
                "COMPLEMENTS_CLASSIC_VIS": {},
            },
            "FREQUENCY": {"AGILE": {}, "RELEASE": {}, "1_WEEK": {}, "DAY_TO_DAY": {}},
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
            },
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
            },
            "ATTACK_SPEED": {"LOW": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}, "NOT_FOUND": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {},
            },
            "MONSTER_RESPAWN": {"NOT_INTUITIVE": {}},
            "CONTROLS": {"INTUITIVE": {}},
            "TASKLIST": {"MISSING_HIGH": {}},
        },
        "NAVIGATION": {
            "EXPLORING": {"HARD_WHEN_MONSTERS": {}, "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}},
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {},
                "NOT_INTUITIVE": {},
                "NOT_USED": {},
            },
            "DIG_GO_UP": {"INTERESTING": {}},
            "CODEBASE_UNKNOWN": {"FILE_STRUCTURE_UNKNOWN": {}},
        },
        "PROJECT_SELECTION": {
            "FIRST_ACTION": {"BROWSING": {}},
            "RECOMMENDED": {"UNNOTICED": {}},
            "WORK_WITH_LOCAL_FILES": {},
        },
        "TARGET_USER": {
            "ME": {
                "POSITIVE": {},
                "MEDIUM": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
            },
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "TEAM": {"POSITIVE": {}},
            "STRONG_INDIVIDUALS": {"NEGATIVE": {}},
            "DEV": {"MEDIUM": {}, "POSITIVE": {}},
            "GAME_DEV": {"POSITIVE": {}},
            "MANAGER": {"POSITIVE": {}},
            "JUNIOR_DEV": {"POSITIVE": {}},
            "SOLUTION_ARCHITECT": {"POSITIVE": {}},
            "CODER": {"POSITIVE": {}},
            "TESTER": {"POSITIVE": {}},
            "FUNCTIONAL_ANALYST": {"NEGATIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {},
            },
            "FIXING_RATIONALE": {"BEING_OVERWHELMED": {}},
            "REQUIREMENT": {"BIG_PROJECT": {}},
            "REFERENCE_POINT_FOR_COMPARISON": {"MISSING": {}},
            "THREAT": {"BAD_CODE_ON_PURPOSE": {}, "IMPOSED_TOOL": {}},
            "GAMIFICATION": {"MISSING": {}},
            "MUST_KNOW_CODEBASE": {},
        },
        "INFORMATION": {
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "MISSING_CONTEXT_INFORMATION": {},
                "LEAVING_EARLY": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {"UNKNOWN": {}},
            "ROOM_CLEANED_NOTIFICATION": {"MISSING": {}, "INTERPRETATION_ISSUE": {}},
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
            },
            "FREEZE_NAME": {"UNCLEAR": {}},
            "FREEZE_KEY": {"HARD_RECALL": {}, "MISSED": {}},
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {},
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_ON_PURPOSE": {},
                "NOT_FOUND": {},
            },
            "LEARNING_CURVE": {"MEDIUM": {}},
            "FILE_NAME_INDICATOR": {"DISCRETE": {}, "NOTICED": {}, "NOT_INTUITIVE": {}},
            "FILE_HOVER": {
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_FOUND": {},
            },
            "FREEZE_FREEZE": {"USEFUL_TO_LOOK_AROUND": {}, "MISSED": {}, "FOUND": {}},
            "MAP_SEARCH_BAR": {"NOT_USED": {}},
            "NUMERICAL_VALUES": {"MISSING": {}},
            "MONSTER_NB_TOT": {"INTUITIVE": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}, "INTUITIVE": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
            "MUSIC": {"TOO_NERVOUS": {}},
            "VOLUME": {"TOO_LOUD": {}, "NOT_MODIFIABLE": {}},
            "ENEMY_TYPE": {"DIFFERENTIABLE": {}},
        },
        "PERFORMANCE": {"LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}}},
    },
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}, "COLORS_LINK_MISSING": {}},
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "FUNKY": {
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
                "WANT_REVERSED": {},
            },
            "RAINBOW": {"LEFT_TO_RIGHT": {}},
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_GROUND": {}},
            "CODE_SMELLS": {"HARD_RECALL": {}, "NOTICED": {}},
            "VULNS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_WALL": {}},
            "FILE_TYPE": {"ADD_MAPPING": {}},
            "MONSTER_SIZE": {"NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MONSTER_NUMBER": {"SUM_SUBDIRECTORIES": {}, "INTUITIVE": {}},
            "MONSTERS": {"ARE_ISSUES": {}, "NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MUSIC": {"IS_DANGER": {}},
            "COLORS": {
                "GENERAL_QUALITY": {},
                "NOT_INTUITIVE": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {},
            },
            "FILE_SIZE": {"ADD_MAPPING": {}, "IS_SUB_DIR_SQUARE_SIZE": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "PAIR_PROGRAMMING": {},
                "TASK_LIST": {},
                "TEACH": {},
                "COMPLEMENTS_CLASSIC_VIS": {},
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {},
                "TRY_BY_CURIOSITY": {},
            },
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
            },
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
                "FLEE": {},
                "ONLY_WHEN_FEELING_ACHIEVABLE": {},
            },
            "ATTACK_SPEED": {"LOW": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}, "NOT_FOUND": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {},
            },
            "MONSTER_RESPAWN": {"NOT_INTUITIVE": {}},
            "CONTROLS": {"INTUITIVE": {}},
            "TASKLIST": {"MISSING_HIGH": {}},
            "GO_UP_KEY": {"MISSED": {}},
            "FILE_EDITION": {"EXPECTED": {}},
        },
        "NAVIGATION": {
            "EXPLORING": {"HARD_WHEN_MONSTERS": {}, "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}},
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {},
                "NOT_INTUITIVE": {},
                "NOT_USED": {},
            },
            "DIG_GO_UP": {"INTERESTING": {}},
            "CODEBASE_UNKNOWN": {"FILE_STRUCTURE_UNKNOWN": {}},
        },
        "PROJECT_SELECTION": {
            "FIRST_ACTION": {"BROWSING": {}},
            "RECOMMENDED": {"UNNOTICED": {}},
            "WORK_WITH_LOCAL_FILES": {},
        },
        "TARGET_USER": {
            "ME": {
                "POSITIVE": {},
                "MEDIUM": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
            },
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "TEAM": {"POSITIVE": {}},
            "STRONG_INDIVIDUALS": {"NEGATIVE": {}},
            "DEV": {"MEDIUM": {}, "POSITIVE": {}},
            "GAME_DEV": {"POSITIVE": {}},
            "MANAGER": {"MEDIUM": {}, "POSITIVE": {}},
            "JUNIOR_DEV": {"POSITIVE": {}},
            "SOLUTION_ARCHITECT": {"POSITIVE": {}},
            "CODER": {"POSITIVE": {}},
            "TESTER": {"POSITIVE": {}},
            "FUNCTIONAL_ANALYST": {"NEGATIVE": {}},
            "UX_DESIGNER": {"POSITIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {},
            },
            "FIXING_RATIONALE": {"BEING_OVERWHELMED": {}},
            "REQUIREMENT": {"BIG_PROJECT": {}},
            "REFERENCE_POINT_FOR_COMPARISON": {"MISSING": {}},
            "THREAT": {"BAD_CODE_ON_PURPOSE": {}, "IMPOSED_TOOL": {}},
            "GAMIFICATION": {"MISSING": {}},
            "MUST_KNOW_CODEBASE": {},
        },
        "INFORMATION": {
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "MISSING_CONTEXT_INFORMATION": {},
                "CONTROLS_UNNOTICED": {},
                "LEAVING_EARLY": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {"UNKNOWN": {}},
            "ROOM_CLEANED_NOTIFICATION": {"MISSING": {}, "INTERPRETATION_ISSUE": {}},
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
            },
            "MAP_NUMBER": {"EMPIRICAL_DEDUCTION": {}},
            "FREEZE_NAME": {"UNCLEAR": {}},
            "FREEZE_KEY": {"HARD_RECALL": {}, "MISSED": {}},
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {},
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_ON_PURPOSE": {},
                "NOT_FOUND": {},
            },
            "LEARNING_CURVE": {"MEDIUM": {}},
            "FILE_NAME_INDICATOR": {"DISCRETE": {}, "NOTICED": {}, "NOT_INTUITIVE": {}},
            "FILE_HOVER": {
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_FOUND": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {},
                "TO_FIGHT": {},
            },
            "MAP_SEARCH_BAR": {"TYPE_NAME_OF_FILE": {}, "NOT_USED": {}},
            "NUMERICAL_VALUES": {"MISSING": {}},
            "MONSTER_NB_TOT": {"INTUITIVE": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}, "INTUITIVE": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
            "MUSIC": {"TOO_NERVOUS": {}},
            "VOLUME": {"TOO_LOUD": {}, "NOT_MODIFIABLE": {}},
            "ENEMY_TYPE": {"DIFFERENTIABLE": {}},
        },
        "PERFORMANCE": {
            "LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}},
            "PROJECT_LOADING": {"BORING": {}},
        },
    },
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}, "COLORS_LINK_MISSING": {}},
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "FUNKY": {
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
                "WANT_REVERSED": {},
            },
            "RAINBOW": {"LEFT_TO_RIGHT": {}},
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_GROUND": {}},
            "CODE_SMELLS": {"HARD_RECALL": {}, "NOTICED": {}},
            "VULNS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_WALL": {}},
            "FILE_TYPE": {"ADD_MAPPING": {}},
            "MONSTER_SIZE": {"NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MONSTER_NUMBER": {"SUM_SUBDIRECTORIES": {}, "INTUITIVE": {}},
            "MONSTERS": {"ARE_ISSUES": {}, "NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MUSIC": {"IS_DANGER": {}},
            "COLORS": {
                "GENERAL_QUALITY": {},
                "NOT_INTUITIVE": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {},
            },
            "FILE_SIZE": {"ADD_MAPPING": {}, "IS_SUB_DIR_SQUARE_SIZE": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "PAIR_PROGRAMMING": {},
                "TASK_LIST": {},
                "TEACH": {},
                "COMPLEMENTS_CLASSIC_VIS": {},
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {},
                "TRY_BY_CURIOSITY": {},
                "EARLY_STAGE": {},
            },
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
            },
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
                "FLEE": {},
                "ONLY_WHEN_FEELING_ACHIEVABLE": {},
            },
            "ATTACK_SPEED": {"LOW": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}, "USABILITY_BAD": {}, "NOT_FOUND": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {},
            },
            "MONSTER_RESPAWN": {"NOT_INTUITIVE": {}},
            "CONTROLS": {"INTUITIVE": {}, "NOT_INTUITIVE": {}, "SPAM_ATTACK": {}},
            "TASKLIST": {"MISSING_HIGH": {}},
            "GO_UP_KEY": {"MISSED": {}},
            "FILE_EDITION": {"EXPECTED": {}},
        },
        "NAVIGATION": {
            "EXPLORING": {"HARD_WHEN_MONSTERS": {}, "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}},
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {},
                "NOT_INTUITIVE": {},
                "NOT_USED": {},
            },
            "TRACKPAD": {"BAD": {}},
            "DIG_GO_UP": {"INTERESTING": {}},
            "CODEBASE_UNKNOWN": {"FILE_STRUCTURE_UNKNOWN": {}},
        },
        "PROJECT_SELECTION": {
            "FIRST_ACTION": {"BROWSING": {}},
            "RECOMMENDED": {"UNNOTICED": {}},
            "WORK_WITH_LOCAL_FILES": {},
        },
        "TARGET_USER": {
            "ME": {
                "POSITIVE": {},
                "MEDIUM": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
            },
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "TEAM": {"POSITIVE": {}},
            "STRONG_INDIVIDUALS": {"NEGATIVE": {}},
            "DEV": {"MEDIUM": {}, "POSITIVE": {}},
            "GAME_DEV": {"POSITIVE": {}},
            "MANAGER": {"MEDIUM": {}, "POSITIVE": {}},
            "JUNIOR_DEV": {"POSITIVE": {}},
            "SOLUTION_ARCHITECT": {"POSITIVE": {}},
            "CODER": {"POSITIVE": {}},
            "TESTER": {"POSITIVE": {}},
            "FUNCTIONAL_ANALYST": {"NEGATIVE": {}},
            "UX_DESIGNER": {"POSITIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {},
            },
            "FIXING_RATIONALE": {"BEING_OVERWHELMED": {}},
            "REQUIREMENT": {"BIG_PROJECT": {}},
            "REFERENCE_POINT_FOR_COMPARISON": {"MISSING": {}},
            "THREAT": {"BAD_CODE_ON_PURPOSE": {}, "IMPOSED_TOOL": {}},
            "GAMIFICATION": {"MISSING": {}},
            "MUST_KNOW_CODEBASE": {},
        },
        "INFORMATION": {
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "MISSING_CONTEXT_INFORMATION": {},
                "CONTROLS_UNNOTICED": {},
                "LEAVING_EARLY": {},
                "CLICK_ON_MONSTER": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {"UNKNOWN": {}},
            "ROOM_CLEANED_NOTIFICATION": {"MISSING": {}, "INTERPRETATION_ISSUE": {}},
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
                "NOT_INTUITIVE": {},
            },
            "MAP_NUMBER": {"EMPIRICAL_DEDUCTION": {}},
            "FREEZE_NAME": {"UNCLEAR": {}},
            "FREEZE_KEY": {"HARD_RECALL": {}, "MISSED": {}},
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {},
                "NOT_INTUITIVE": {},
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_ON_PURPOSE": {},
                "NOT_FOUND": {},
            },
            "LEARNING_CURVE": {"MEDIUM": {}},
            "FILE_NAME_INDICATOR": {"DISCRETE": {}, "NOTICED": {}, "NOT_INTUITIVE": {}},
            "FILE_HOVER": {
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_FOUND": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {},
                "TO_FIGHT": {},
            },
            "MAP_SEARCH_BAR": {"TYPE_NAME_OF_FILE": {}, "NOT_USED": {}},
            "NUMERICAL_VALUES": {"MISSING": {}},
            "MONSTER_NB_TOT": {"INTUITIVE": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}, "INTUITIVE": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
            "MUSIC": {"TOO_NERVOUS": {}, "NEEDS_CUSTOMIZATION": {}},
            "VOLUME": {"TOO_LOUD": {}, "NOT_MODIFIABLE": {}},
            "ENEMY_TYPE": {"DIFFERENTIABLE": {}},
        },
        "PERFORMANCE": {
            "LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}},
            "PROJECT_LOADING": {"BORING": {}},
            "BUG": {"OUT_OF_MAP": {}},
        },
    },
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}, "COLORS_LINK_MISSING": {}},
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "FUNKY": {
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
                "WANT_REVERSED": {},
            },
            "RAINBOW": {"LEFT_TO_RIGHT": {}},
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_GROUND": {}},
            "CODE_SMELLS": {"HARD_RECALL": {}, "NOTICED": {}},
            "VULNS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_WALL": {}},
            "FILE_TYPE": {"ADD_MAPPING": {}},
            "MONSTER_SIZE": {"NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MONSTER_NUMBER": {"SUM_SUBDIRECTORIES": {}, "INTUITIVE": {}},
            "MONSTERS": {"ARE_ISSUES": {}, "NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MUSIC": {"IS_DANGER": {}},
            "COLORS": {
                "GENERAL_QUALITY": {},
                "NOT_INTUITIVE": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {},
            },
            "FILE_SIZE": {"ADD_MAPPING": {}, "IS_SUB_DIR_SQUARE_SIZE": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "PAIR_PROGRAMMING": {},
                "ASSIGNMENT_MARKING": {},
                "TASK_LIST": {},
                "TEACH": {},
                "COMPLEMENTS_CLASSIC_VIS": {},
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {},
                "TRY_BY_CURIOSITY": {},
                "EARLY_STAGE": {},
            },
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
                "DETAILS_HARD_TO_ACCESS": {},
            },
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
                "FLEE": {},
                "ONLY_WHEN_FEELING_ACHIEVABLE": {},
                "FORCES_DIGGING": {},
            },
            "ATTACK_SPEED": {"LOW": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}, "USABILITY_BAD": {}, "NOT_FOUND": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {},
            },
            "MONSTER_RESPAWN": {"NOT_INTUITIVE": {}},
            "CONTROLS": {"INTUITIVE": {}, "NOT_INTUITIVE": {}, "SPAM_ATTACK": {}},
            "TASKLIST": {"MISSING_HIGH": {}},
            "DIG_KEY": {"INTUITIVE": {}},
            "GO_UP_KEY": {"MISSED": {}},
            "SONARCLOUD_INTEGRATION": {"MISSING": {}},
            "GAME_WINDOW": {"SMALL": {}},
            "FILE_EDITION": {"EXPECTED": {}},
        },
        "NAVIGATION": {
            "EXPLORING": {"HARD_WHEN_MONSTERS": {}, "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}},
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {},
                "NOT_INTUITIVE": {},
                "NOT_USED": {},
            },
            "TRACKPAD": {"BAD": {}},
            "DIG_GO_UP": {"INTERESTING": {}, "NOT_INTUITIVE": {}},
            "CODEBASE_UNKNOWN": {"FILE_STRUCTURE_UNKNOWN": {}},
        },
        "PROJECT_SELECTION": {
            "FIRST_ACTION": {"BROWSING": {}},
            "RECOMMENDED": {"UNNOTICED": {}},
            "WORK_WITH_LOCAL_FILES": {},
        },
        "TARGET_USER": {
            "ME": {
                "POSITIVE": {},
                "MEDIUM": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
                "CLASSIC_VIS_MORE_COMPLETE": {},
            },
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "TEAM": {"POSITIVE": {}},
            "STRONG_INDIVIDUALS": {"NEGATIVE": {}},
            "DEV": {"MEDIUM": {}, "POSITIVE": {}, "LOW": {}},
            "GAME_DEV": {"POSITIVE": {}},
            "MANAGER": {"MEDIUM": {}, "POSITIVE": {}},
            "JUNIOR_DEV": {"POSITIVE": {}},
            "SOLUTION_ARCHITECT": {"POSITIVE": {}},
            "CODER": {"POSITIVE": {}},
            "TESTER": {"POSITIVE": {}},
            "FUNCTIONAL_ANALYST": {"NEGATIVE": {}},
            "UX_DESIGNER": {"POSITIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {},
            },
            "FIXING_RATIONALE": {"BEING_OVERWHELMED": {}},
            "REQUIREMENT": {"BIG_PROJECT": {}},
            "REFERENCE_POINT_FOR_COMPARISON": {"MISSING": {}},
            "THREAT": {"BAD_CODE_ON_PURPOSE": {}, "IMPOSED_TOOL": {}},
            "GAMIFICATION": {"MISSING": {}},
            "MUST_KNOW_CODEBASE": {},
        },
        "INFORMATION": {
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "MISSING_CONTEXT_INFORMATION": {},
                "CONTROLS_UNNOTICED": {},
                "LEAVING_EARLY": {},
                "CLICK_ON_MONSTER": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {"UNKNOWN": {}},
            "ROOM_CLEANED_NOTIFICATION": {"MISSING": {}, "INTERPRETATION_ISSUE": {}},
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
                "NOT_INTUITIVE": {},
            },
            "MAP_NUMBER": {"EMPIRICAL_DEDUCTION": {}},
            "FREEZE_NAME": {"UNCLEAR": {}},
            "FREEZE_KEY": {"HARD_RECALL": {}, "MISSED": {}},
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {},
                "NOT_INTUITIVE": {},
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "USEFUL": {},
                "INTUITIVE": {},
                "NOT_USED": {},
                "NOT_ON_PURPOSE": {},
                "NOT_FOUND": {},
            },
            "LEARNING_CURVE": {"MEDIUM": {}},
            "FILE_NAME_INDICATOR": {"DISCRETE": {}, "NOTICED": {}, "NOT_INTUITIVE": {}},
            "FILE_HOVER": {
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_FOUND": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {},
                "TO_FIGHT": {},
            },
            "MAP_SEARCH_BAR": {"TYPE_NAME_OF_FILE": {}, "NOT_USED": {}},
            "NUMERICAL_VALUES": {"MISSING": {}},
            "MONSTER_NB_TOT": {"INTUITIVE": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}, "INTUITIVE": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
            "MUSIC": {"TOO_NERVOUS": {}, "NEEDS_CUSTOMIZATION": {}},
            "VOLUME": {"TOO_LOUD": {}, "NOT_MODIFIABLE": {}},
            "ENEMY_TYPE": {"DIFFERENTIABLE": {}},
        },
        "PERFORMANCE": {
            "LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}},
            "PROJECT_LOADING": {"BORING": {}},
            "BUG": {"OUT_OF_MAP": {}},
            "ISSUE_ACCESS": {"SLOW_LOADING": {}},
        },
    },
    {
        "MAPPING": {
            "MAP": {"PACKAGE_STRUCTURE": {}, "COLORS_LINK_MISSING": {}},
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {},
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "FUNKY": {
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
                "WANT_REVERSED": {},
            },
            "RAINBOW": {
                "LEFT_TO_RIGHT": {},
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_GROUND": {},
            },
            "CODE_SMELLS": {"HARD_RECALL": {}, "NOTICED": {}, "TERM_UNKNOWN": {}},
            "VULNS": {"HARD_RECALL": {}, "NOTICED": {}, "IS_WALL": {}},
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {"NOT_INTUITIVE": {}, "INTUITIVE": {}},
            "MONSTER_NUMBER": {
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTERS": {
                "ARE_ISSUES": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
                "MISSING_AS_IN_GAME_ELEMENTS": {},
            },
            "MUSIC": {"IS_DANGER": {}},
            "COLORS": {
                "GENERAL_QUALITY": {},
                "NOT_INTUITIVE": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {},
            },
            "FILE_SIZE": {"ADD_MAPPING": {}, "IS_SUB_DIR_SQUARE_SIZE": {}},
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {},
        },
        "USAGE": {
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "PAIR_PROGRAMMING": {},
                "ASSIGNMENT_MARKING": {},
                "TASK_LIST": {},
                "TEACH": {},
                "COMPLEMENTS_CLASSIC_VIS": {},
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {},
                "TRY_BY_CURIOSITY": {},
                "EARLY_STAGE": {},
            },
            "DILEMMA": {"ISSUE": {}},
            "THREAT": {"BOSS_AGAINST": {}},
            "DILEMMA_GAME": {"LESS_INFORMATIVE": {}, "DISTURBING": {}},
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
                "DETAILS_HARD_TO_ACCESS": {},
            },
        },
        "GAMEPLAY": {
            "COMBAT_DIVERSITY": {"LOW": {}},
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
                "FLEE": {},
                "ONLY_WHEN_FEELING_ACHIEVABLE": {},
                "FORCES_DIGGING": {},
                "RUSH": {},
            },
            "ATTACK_SPEED": {"LOW": {}},
            "DAMAGE_DEALT": {"LOW": {}},
            "PLAYER_UPGRADES": {"LACKING": {}},
            "MAP": {"USABILITY_GOOD": {}, "USABILITY_BAD": {}, "NOT_FOUND": {}},
            "LOG_BOOK": {"MISSING_LOW": {}},
            "MINIMAP": {"MISSING_HIGH": {}},
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {},
            },
            "MONSTER_RESPAWN": {"NOT_INTUITIVE": {}},
            "CONTROLS": {
                "INTUITIVE": {},
                "NOT_INTUITIVE": {},
                "SPAM_ATTACK": {},
                "STROKE_MOUVEMENTS": {},
                "HANDS_USAGE_EVOLUTION": {},
            },
            "TASKLIST": {"MISSING_HIGH": {}},
            "DIG_KEY": {
                "INTUITIVE": {},
            },
            "GO_UP_KEY": {"MISSED": {}},
            "SONARCLOUD_INTEGRATION": {"MISSING": {}},
            "GAME_WINDOW": {"SMALL": {}},
            "FILE_EDITION": {
                "EXPECTED": {},
            },
        },
        "NAVIGATION": {
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {},
                "NEED_TO_EXPLORE_ROOM_BY_ROOM": {},
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {},
                "NOT_INTUITIVE": {},
                "NOT_USED": {},
                "HARD_RECALL": {},
            },
            "TRACKPAD": {
                "BAD": {},
            },
            "DIG_GO_UP": {
                "INTERESTING": {},
                "NOT_INTUITIVE": {},
            },
            "CODEBASE_UNKNOWN": {"FILE_STRUCTURE_UNKNOWN": {}},
        },
        "PROJECT_SELECTION": {
            "FIRST_ACTION": {"BROWSING": {}},
            "RECOMMENDED": {"UNNOTICED": {}},
            "WORK_WITH_LOCAL_FILES": {},
        },
        "TARGET_USER": {
            "ME": {
                "POSITIVE": {},
                "MEDIUM": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
                "CLASSIC_VIS_MORE_COMPLETE": {},
            },
            "STUDENTS": {"POSITIVE": {}},
            "TEACHERS": {"POSITIVE": {}},
            "TEAM": {"POSITIVE": {}},
            "STRONG_INDIVIDUALS": {"NEGATIVE": {}},
            "DEV": {"MEDIUM": {}, "POSITIVE": {}, "LOW": {}},
            "GAME_DEV": {"POSITIVE": {}},
            "MANAGER": {"MEDIUM": {}, "POSITIVE": {}},
            "JUNIOR_DEV": {"POSITIVE": {}},
            "SOLUTION_ARCHITECT": {"POSITIVE": {}},
            "CODER": {"POSITIVE": {}},
            "TESTER": {"POSITIVE": {}},
            "FUNCTIONAL_ANALYST": {"NEGATIVE": {}},
            "UX_DESIGNER": {"POSITIVE": {}},
        },
        "ENGAGEMENT": {
            "USER_AGENCY": {"LACKING": {}},
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {},
            },
            "FIXING_RATIONALE": {"BEING_OVERWHELMED": {}},
            "REQUIREMENT": {"BIG_PROJECT": {}},
            "REFERENCE_POINT_FOR_COMPARISON": {"MISSING": {}},
            "THREAT": {"BAD_CODE_ON_PURPOSE": {}, "IMPOSED_TOOL": {}},
            "GAMIFICATION": {"MISSING": {}},
            "MUST_KNOW_CODEBASE": {},
        },
        "INFORMATION": {
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "MISSING_CONTEXT_INFORMATION": {},
                "CONTROLS_UNNOTICED": {},
                "LEAVING_EARLY": {},
                "CLICK_ON_MONSTER": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
            },
            "SUB_FOLDER_NAME": {"UNKNOWN": {}},
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {},
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
                "NOT_INTUITIVE": {},
            },
            "MAP_NUMBER": {"EMPIRICAL_DEDUCTION": {}},
            "FREEZE_NAME": {"UNCLEAR": {}},
            "FREEZE_KEY": {"HARD_RECALL": {}, "MISSED": {}},
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {},
                "NOT_INTUITIVE": {},
                "DIG_GO_UP_LABEL_UNCLEAR": {},
                "MONSTERS_UNCLEAR": {},
                "Q_LABEL_NOT_CLEAR": {},
                "ARROW_KEYS_MISSING_INFORMATION": {},
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "USEFUL": {},
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_ON_PURPOSE": {},
                "NOT_FOUND": {},
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
                "NOT_INTUITIVE": {},
            },
            "FILE_HOVER": {
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_FOUND": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "NOT_INTUITIVE_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {},
                "TO_FIGHT": {},
            },
            "MAP_SEARCH_BAR": {
                "TYPE_NAME_OF_FILE": {},
                "NOT_USED": {},
            },
            "NUMERICAL_VALUES": {"MISSING": {}},
            "MONSTER_NB_TOT": {"INTUITIVE": {}},
        },
        "ART": {
            "CHARACTER": {"CONTRAST_WELL": {}},
            "RAINBOW": {"GOOD": {}, "INTUITIVE": {}},
            "GAME_LAYOUT": {"GOOD": {}},
            "ANIMATION": {"GOOD": {}},
            "FUNKY": {"BAD": {}, "NOT_INTUITIVE": {}},
            "MUSIC": {"TOO_NERVOUS": {}, "NEEDS_CUSTOMIZATION": {}},
            "VOLUME": {"TOO_LOUD": {}, "NOT_MODIFIABLE": {}},
            "ENEMY_TYPE": {"DIFFERENTIABLE": {}},
        },
        "PERFORMANCE": {
            "LAG": {"NOTICED": {}, "SOLUTION_LIMIT_SPAWN": {}},
            "PROJECT_LOADING": {"BORING": {}},
            "BUG": {"OUT_OF_MAP": {}},
            "ISSUE_ACCESS": {
                "SLOW_LOADING": {},
            },
        },
    },
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {},
                "COLORS_LINK_MISSING": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {}
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "FUNKY":{
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
                "WANT_REVERSED": {},
            },
            "RAINBOW":{
                "LEFT_TO_RIGHT": {},
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_GROUND": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "TERM_UNKNOWN": {}
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_WALL": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTER_DAMAGE": {
                "EXPECT_MAPPING_WITH_SIZE": {},
            },
            "MONSTER_HEALTH": {
                "VARIATE": {},
            },
            "MONSTERS":{
                "ARE_ISSUES": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
                "MISSING_AS_IN_GAME_ELEMENTS": {}
            },
            "MUSIC":{
                "IS_DANGER": {}
            },
            "COLORS":{
                "GENERAL_QUALITY": {},
                "NOT_INTUITIVE": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {},
                "MAPPED_TO_TILE_NUMBER": {}
            },
            "FILE_SIZE": {
                "ADD_MAPPING": {},
                "IS_SUB_DIR_SQUARE_SIZE": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "CHECK_EVOLUTION": {},
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "PAIR_PROGRAMMING": {},
                "ASSIGNMENT_MARKING": {},
                "TASK_LIST": {},
                "TEACH": {},
                "COMPLEMENTS_CLASSIC_VIS": {},
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {},
                "TRY_BY_CURIOSITY": {},
                "EARLY_STAGE": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "THREAT": {
                "BOSS_AGAINST": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {},
                "USELESS": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
                "DETAILS_HARD_TO_ACCESS": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
                "FLEE": {},
                "ONLY_WHEN_FEELING_ACHIEVABLE": {},
                "FORCES_DIGGING": {},
                "RUSH": {},
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {},
                "USABILITY_BAD": {},
                "NOT_FOUND": {},
                "NOT_USED": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
            "CONTROLS": {
                "INTUITIVE": {},
                "NOT_INTUITIVE": {},
                "SPAM_ATTACK": {},
                "STROKE_MOUVEMENTS": {},
                "HANDS_USAGE_EVOLUTION": {}
            },
            "TASKLIST": {
                "MISSING_HIGH": {}
            },
            "DIG_KEY": {
                "INTUITIVE": {},
            },
            "GO_UP_KEY": {
                "MISSED": {}
            },
            "SONARCLOUD_INTEGRATION": {
                "MISSING": {}
            },
            "GAME_WINDOW": {
                "SMALL": {}
            },
            "HEARTS": {
                "USELESS": {}
            },
            "MONSTER_TYPE": {
                "NO_GAMING_DIFFERENCE": {}
            },
            "FILE_EDITION": {
                "EXPECTED": {},
            }
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {},
                "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {},
                "NOT_INTUITIVE": {},
                "NOT_USED": {},
                "HARD_RECALL": {},
            },
            "TRACKPAD": {
                "BAD": {},
            },
            "DIG_GO_UP": {
                "INTERESTING": {},
                "NOT_INTUITIVE": {},
            },
            "CODEBASE_UNKNOWN": {
                "FILE_STRUCTURE_UNKNOWN": {}
            }
        },
        "PROJECT_SELECTION":{
            "FIRST_ACTION": {
                "BROWSING": {}
            },
            "RECOMMENDED": {
                "UNNOTICED": {}
            },
            "WORK_WITH_LOCAL_FILES": {}
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "MEDIUM": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
                "CLASSIC_VIS_MORE_COMPLETE": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {},
                "POSITIVE": {},
                "LOW": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            },
            "MANAGER": {
                "MEDIUM": {},
                "POSITIVE": {}
            },
            "JUNIOR_DEV": {
                "POSITIVE": {},
                "NEGATIVE": {}
            },
            "SENIOR_DEV": {
                "NEGATIVE": {}
            },
            "SOLUTION_ARCHITECT": {
                "POSITIVE": {}
            },
            "CODER": {
                "POSITIVE": {}
            },
            "TESTER": {
                "POSITIVE": {}
            },
            "FUNCTIONAL_ANALYST": {
                "NEGATIVE": {}
            },
            "UX_DESIGNER": {
                "POSITIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
                "KILL_ALL_MONSTERS": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {}
            },
            "FIXING_RATIONALE": {
                "BEING_OVERWHELMED": {}
            },
            "REQUIREMENT": {
                "BIG_PROJECT": {},
                "NOT_BIG_PROJECTS": {}
            },
            "REFERENCE_POINT_FOR_COMPARISON": {
                "MISSING": {}
            },
            "THREAT":{
                "BAD_CODE_ON_PURPOSE": {},
                "IMPOSED_TOOL": {}
            },
            "GAMIFICATION": {
                "MISSING": {}
            },
            "MUST_KNOW_CODEBASE":{}
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "MISSING_CONTEXT_INFORMATION": {},
                "CONTROLS_UNNOTICED": {},
                "LEAVING_EARLY": {},
                "CLICK_ON_MONSTER": {},
                "NEED_GUIDING": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
                "COMPLEX": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
                "NOT_INTUITIVE": {}
            },
            "MAP_NUMBER": {
                "EMPIRICAL_DEDUCTION": {}
            },
            "FREEZE_NAME": {
                "UNCLEAR": {}
            },
            "FREEZE_KEY": {
                "HARD_RECALL": {},
                "MISSED": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {},
                "NOT_INTUITIVE": {},
                "DIG_GO_UP_LABEL_UNCLEAR": {},
                "MONSTERS_UNCLEAR": {},
                "Q_LABEL_NOT_CLEAR": {},
                "ARROW_KEYS_MISSING_INFORMATION": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "USEFUL": {},
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_ON_PURPOSE": {},
                "NOT_FOUND": {}
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
                "NOT_INTUITIVE": {},
            },
            "FILE_HOVER": {
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_FOUND": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "NOT_INTUITIVE_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {},
                "TO_FIGHT": {},
                "USEFUL": {},
            },
            "MAP_SEARCH_BAR": {
                "TYPE_NAME_OF_FILE": {},
                "NOT_USED": {},
            },
            "NUMERICAL_VALUES": {
                "MISSING": {}
            },
            "MONSTER_NB_TOT": {
                "INTUITIVE": {},
                "NOT_INTUITIVE": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "INTUITIVE": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {},
                "NOT_INTUITIVE": {}
            },
            "MUSIC": {
                "TOO_NERVOUS": {},
                "NEEDS_CUSTOMIZATION": {},
                "DISLIKED": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
            "DESIGN": {
                "GOOD": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            },
            "PROJECT_LOADING": {
                "BORING": {}
            },
            "BUG": {
                "OUT_OF_MAP": {}
            },
            "ISSUE_ACCESS": {
                "SLOW_LOADING": {},
            }
        }
    }
    ,
    {
        "MAPPING":{
            "MAP": {
                "PACKAGE_STRUCTURE": {},
                "COLORS_LINK_MISSING": {}
            },
            "COMBAT": {
                "NO_LESSON": {},
                "OVERWHELMING_IS_BAD_CODE": {},
                "CLEANABLE_IS_MANAGEABLE": {}
            },
            "ROOM": {
                "PACKAGE_STRUCTURE": {},
                "VULN_SOURCE_IN_LEAF": {},
                "NOT_INTUITIVE": {},
            },
            "FUNKY":{
                "EMPIRICAL_DEDUCTION": {},
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
                "WANT_REVERSED": {},
                "NOT_INTUITIVE": {},
                "DISCRIMINABLE": {},
                "NOT_DISCRIMINABLE": {},
            },
            "RAINBOW":{
                "LEFT_TO_RIGHT": {},
                "INTUITIVE": {},
            },
            "SECURITY_METRIC": {
                "IS_CLASS_VISIBILITY": {},
                "IS_COLORS": {},
                "IS_SMELL_VOLATILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "MAINTAINABILITY_METRIC": {
                "CONFUSING": {},
                "CRACKS_NOT_FOUND": {},
                "NOT_INTUITIVE": {},
            },
            "RELIABILITY_METRIC": {
                "IS_REPLICABILITY": {},
                "NOTICED": {},
                "HARD_RECALL": {},
                "NOT_INTUITIVE": {},
            },
            "BUGS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_GROUND": {},
            },
            "CODE_SMELLS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "TERM_UNKNOWN": {}
            },
            "VULNS": {
                "HARD_RECALL": {},
                "NOTICED": {},
                "IS_WALL": {}
            },
            "FILE_TYPE": {
                "ADD_MAPPING": {},
            },
            "MONSTER_SIZE": {
                "NOT_INTUITIVE": {},
                "INTUITIVE": {}
            },
            "MONSTER_NUMBER": {
                "SUM_SUBDIRECTORIES": {},
                "INTUITIVE": {},
            },
            "MONSTER_DAMAGE": {
                "EXPECT_MAPPING_WITH_SIZE": {},
            },
            "MONSTER_HEALTH": {
                "VARIATE": {},
                "CONFUSING": {}
            },
            "MONSTERS":{
                "ARE_ISSUES": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
                "MISSING_AS_IN_GAME_ELEMENTS": {}
            },
            "MUSIC":{
                "IS_DANGER": {}
            },
            "COLORS":{
                "GENERAL_QUALITY": {},
                "NOT_INTUITIVE": {},
                "ADD_DIFFERENT_COLORS_PER_PURPOSE": {},
                "MAPPED_TO_TILE_NUMBER": {},
                "MUSIC_CORRELATION_USEFUL": {}
            },
            "FILE_SIZE": {
                "ADD_MAPPING": {},
                "IS_SUB_DIR_SQUARE_SIZE": {}
            },
            "DATA_LEAK": {},
            "NO_CODE_NO_ISSUES": {},
            "PERFECT_ROOM_PERFECT_CODE": {}
        },
        "USAGE":{
            "SCENARIO": {
                "COMMUNICATION": {},
                "DEBT_FIGHT_ENGAGEMENT": {},
                "PEOPLE_PERFORMANCE_TRACKING": {},
                "MONITOR_DEBT": {},
                "MANAGEMENT": {},
                "PAIR_PROGRAMMING": {},
                "ASSIGNMENT_MARKING": {},
                "TASK_LIST": {},
                "TEACH": {},
                "COMPLEMENTS_CLASSIC_VIS": {},
            },
            "FREQUENCY": {
                "AGILE": {},
                "RELEASE": {},
                "1_WEEK": {},
                "DAY_TO_DAY": {},
                "TRY_BY_CURIOSITY": {},
                "EARLY_STAGE": {}
            },
            "DILEMMA": {
                "ISSUE": {}
            },
            "THREAT": {
                "BOSS_AGAINST": {}
            },
            "DILEMMA_GAME": {
                "LESS_INFORMATIVE": {},
                "DISTURBING": {},
                "USELESS": {}
            },
            "DILEMMA_TOOL": {
                "MORE_INFORMATIVE": {},
                "IT_IS": {},
                "MISSING_INFORMATION": {},
                "DETAILS_HARD_TO_ACCESS": {},
                "MISSING_EVOLUTION_DETAILS": {}
            }
        },
        "GAMEPLAY":{
            "COMBAT_DIVERSITY": {
                "LOW": {}
            },
            "COMBAT": {
                "PACE_OVERWHELMING": {},
                "OBLITERATION_DESIRED": {},
                "INTUITIVE": {},
                "SIMPLE": {},
                "FLEE": {},
                "ONLY_WHEN_FEELING_ACHIEVABLE": {},
                "FORCES_DIGGING": {},
                "RUSH": {},
            },
            "ATTACK_SPEED": {
                "LOW": {}
            },
            "DAMAGE_DEALT": {
                "LOW": {}
            },
            "PLAYER_UPGRADES": {
                "LACKING": {}
            },
            "MAP": {
                "USABILITY_GOOD": {},
                "USABILITY_BAD": {},
                "NOT_FOUND": {},
                "NOT_USED": {}
            },
            "LOG_BOOK": {
                "MISSING_LOW": {}
            },
            "MINIMAP": {
                "MISSING_HIGH": {}
            },
            "DEATH_RECAP": {
                "MISSING": {}
            },
            "INSTANT_FEEDBACK_FIXING": {
                "MISSING_DOUBT": {},
                "MISSING": {},
                "NEED_SCORE": {}
            },
            "MONSTER_RESPAWN": {
                "NOT_INTUITIVE": {}
            },
            "CONTROLS": {
                "INTUITIVE": {},
                "NOT_INTUITIVE": {},
                "SPAM_ATTACK": {},
                "STROKE_MOUVEMENTS": {},
                "HANDS_USAGE_EVOLUTION": {}
            },
            "TASKLIST": {
                "MISSING_HIGH": {}
            },
            "DIG_KEY": {
                "INTUITIVE": {},
            },
            "GO_UP_KEY": {
                "MISSED": {}
            },
            "SONARCLOUD_INTEGRATION": {
                "MISSING": {}
            },
            "GAME_WINDOW": {
                "SMALL": {}
            },
            "HEARTS": {
                "USELESS": {}
            },
            "MONSTER_TYPE": {
                "NO_GAMING_DIFFERENCE": {}
            },
            "FILE_EDITION": {
                "EXPECTED": {},
            }
        },
        "NAVIGATION":{
            "EXPLORING": {
                "HARD_WHEN_MONSTERS": {},
                "NEED_TO_EXPLORE_ROOM_BY_ROOM": {}
            },
            "MOUSE": {
                "NOT_FOUND": {},
                "USEFUL": {},
                "NOT_INTUITIVE": {},
                "NOT_USED": {},
                "HARD_RECALL": {},
            },
            "TRACKPAD": {
                "BAD": {},
            },
            "DIG_GO_UP": {
                "INTERESTING": {},
                "NOT_INTUITIVE": {},
                "MISSED": {}
            },
            "CODEBASE_UNKNOWN": {
                "FILE_STRUCTURE_UNKNOWN": {}
            }
        },
        "PROJECT_SELECTION":{
            "FIRST_ACTION": {
                "BROWSING": {}
            },
            "RECOMMENDED": {
                "UNNOTICED": {}
            },
            "WORK_WITH_LOCAL_FILES": {},
            "SCROLL":{
                "CLICK_CIRCLE": {}
            }
        },
        "TARGET_USER":{
            "ME": {
                "POSITIVE": {},
                "MEDIUM": {},
                "NEGATIVE": {},
                "CLASSIC_VIS_EASIER": {},
                "GAME_VIS_FUNNIER": {},
                "CLASSIC_VIS_MORE_COMPLETE": {}
            },
            "STUDENTS": {
                "POSITIVE": {}
            },
            "TEACHERS": {
                "POSITIVE": {}
            },
            "TEAM": {
                "POSITIVE": {}
            },
            "STRONG_INDIVIDUALS": {
                "NEGATIVE": {}
            },
            "DEV": {
                "MEDIUM": {},
                "POSITIVE": {},
                "LOW": {}
            },
            "GAME_DEV": {
                "POSITIVE": {}
            },
            "MANAGER": {
                "MEDIUM": {},
                "POSITIVE": {}
            },
            "JUNIOR_DEV": {
                "POSITIVE": {},
                "NEGATIVE": {}
            },
            "SENIOR_DEV": {
                "NEGATIVE": {}
            },
            "SOLUTION_ARCHITECT": {
                "POSITIVE": {}
            },
            "CODER": {
                "POSITIVE": {}
            },
            "TESTER": {
                "POSITIVE": {}
            },
            "FUNCTIONAL_ANALYST": {
                "NEGATIVE": {}
            },
            "UX_DESIGNER": {
                "POSITIVE": {}
            }
        },
        "ENGAGEMENT":{
            "USER_AGENCY": {
                "LACKING": {}
            },
            "GOAL": {
                "LACKING": {},
                "FIND_WORSE_FILE": {},
                "FUN": {},
                "COULD_BE_AN_OUTLET": {},
                "SUMMARY": {},
                "IMPLICIT_FEEDBACK": {},
                "SATISFYING": {},
                "CONFUSING": {},
                "KILL_ALL_MONSTERS": {},
            },
            "FIXING": {
                "POSITIVE": {},
                "NEGATIVE": {},
                "PRIORITIZATION_REQUIRED": {},
                "FOR_MY_PROJECT": {},
                "MEDIUM": {}
            },
            "FIXING_RATIONALE": {
                "BEING_OVERWHELMED": {}
            },
            "REQUIREMENT": {
                "BIG_PROJECT": {},
                "NOT_BIG_PROJECTS": {}
            },
            "REFERENCE_POINT_FOR_COMPARISON": {
                "MISSING": {}
            },
            "THREAT":{
                "BAD_CODE_ON_PURPOSE": {},
                "IMPOSED_TOOL": {}
            },
            "GAMIFICATION": {
                "MISSING": {}
            },
            "MUST_KNOW_CODEBASE":{}
        },
        "INFORMATION":{
            "TUTORIAL": {
                "RIGHT_INFORMATION": {},
                "MISSING_TILE_INFORMATION": {},
                "MISSING_CONTEXT_INFORMATION": {},
                "CONTROLS_UNNOTICED": {},
                "LEAVING_EARLY": {},
                "CLICK_ON_MONSTER": {},
                "NEED_GUIDING": {},
            },
            "ROOM_INFORMATION": {
                "OVERWHELMING": {},
                "NOT_INTUITIVE": {},
                "INTUITIVE": {},
                "COMPLEX": {},
            },
            "SUB_FOLDER_NAME": {
                "UNKNOWN": {}
            },
            "ROOM_CLEANED_NOTIFICATION": {
                "MISSING": {},
                "INTERPRETATION_ISSUE": {}
            },
            "TILE_NUMBER": {
                "CONFUSING": {},
                "EMPIRICAL_DEDUCTION": {},
                "INTUITIVE": {},
                "CONFUSING_COMPARABILITY": {},
                "NOT_INTUITIVE": {},
                "MISSING_INFORMATION": {}
            },
            "MAP_NUMBER": {
                "EMPIRICAL_DEDUCTION": {}
            },
            "FREEZE_NAME": {
                "UNCLEAR": {}
            },
            "FREEZE_KEY": {
                "HARD_RECALL": {},
                "MISSED": {}
            },
            "FREEZE_INFORMATION": {
                "DEVY": {},
                "USEFUL": {},
                "OVERWHELMING": {},
                "INTUITIVE": {},
                "SUB_DIR_MISSING": {},
                "NOT_INTUITIVE": {},
                "DIG_GO_UP_LABEL_UNCLEAR": {},
                "MONSTERS_UNCLEAR": {},
                "Q_LABEL_NOT_CLEAR": {},
                "ARROW_KEYS_MISSING_INFORMATION": {}
            },
            "ISSUE_ACCESS": {
                "COOL": {},
                "USEFUL": {},
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_ON_PURPOSE": {},
                "NOT_FOUND": {}
            },
            "LEARNING_CURVE": {
                "MEDIUM": {},
            },
            "FILE_NAME_INDICATOR": {
                "DISCRETE": {},
                "NOTICED": {},
                "NOT_INTUITIVE": {},
            },
            "FILE_HOVER": {
                "INTUITIVE": {},
                "USEFUL": {},
                "NOT_USED": {},
                "NOT_FOUND": {},
            },
            "FREEZE_FREEZE": {
                "USEFUL_TO_LOOK_AROUND": {},
                "NOT_INTUITIVE_TO_LOOK_AROUND": {},
                "MISSED": {},
                "FOUND": {},
                "TO_FIGHT": {},
                "USEFUL": {},
            },
            "MAP_SEARCH_BAR": {
                "TYPE_NAME_OF_FILE": {},
                "NOT_USED": {},
            },
            "NUMERICAL_VALUES": {
                "MISSING": {}
            },
            "MONSTER_NB_TOT": {
                "INTUITIVE": {},
                "NOT_INTUITIVE": {}
            }
        },
        "ART":{
            "CHARACTER": {
                "CONTRAST_WELL": {}
            },
            "RAINBOW": {
                "GOOD": {},
                "NOT_COLORBLIND_FRIENDLY": {}
            },
            "GAME_LAYOUT": {
                "GOOD": {}
            },
            "ANIMATION": {
                "GOOD": {}
            },
            "FUNKY": {
                "BAD": {},
                "COLORBLIND_FRIENDLY": {}
            },
            "MUSIC": {
                "TOO_NERVOUS": {},
                "NEEDS_CUSTOMIZATION": {},
                "DISLIKED": {}
            },
            "VOLUME": {
                "TOO_LOUD": {},
                "NOT_MODIFIABLE": {}
            },
            "ENEMY_TYPE": {
                "DIFFERENTIABLE": {}
            },
            "DESIGN": {
                "GOOD": {}
            },
        },
        "PERFORMANCE":{
            "LAG": {
                "NOTICED": {},
                "SOLUTION_LIMIT_SPAWN": {}
            },
            "PROJECT_LOADING": {
                "BORING": {}
            },
            "BUG": {
                "OUT_OF_MAP": {}
            },
            "ISSUE_ACCESS": {
                "SLOW_LOADING": {},
            }
        }
    }
    
]


def getTags(filePath):
    f = open(filePath, 'r', encoding="utf8")

    tags = []

    # Gather tags
    for line in f:
        tags += getTagsFromLine(line)

    return tags

def getTagsFromLine(line):
    # Return a list of tags cleaned
    tagsFound = []
    export = ""
    started = False
    for c in line:
        if(started):
            if(c == "]"):
                started = False
                if(export[0] == "T"):
                    tag = export.split(":")[1]
                    tagsFound += [tag]

                export = ""
            else:
                export += c
        if(c == "["):
            started = True
    return tagsFound

def getUniqueTags(filePath):
    return removeDuplicates(getTags(filePath))

def removeDuplicates(list):
    ret = []

    for e in list:
        if(e not in ret):
            ret.append(e)
    
    return ret

def tagsToCategories(tags):
    # Transform the tag list in a data structure
    categories = {}
    for tag in tags:
        tagList = tag.split("-")
        thisCat = tagList[0]

        if(thisCat not in categories):
            categories[thisCat] = {}

        if(len(tagList) > 1):
            categories[thisCat][tagList[1]] = {}
    return categories

def generateExistingCategories(data):
    # Remove the themes
    categories = {}

    for theme in data:
        for label in data[theme]:
            if(label not in categories):
                categories[label] = data[theme][label]
            else:
                for sub_label in data[theme][label]:
                    categories[label][sub_label] = {}
    
    return categories

def printListOfCategories(categories):
    p = ""
    for cat in categories:
        p += cat + ", "
    print(p)

def getDifference(baseDic, otherDic):
    returnDic = {}

    for label in otherDic:
        if(label not in baseDic):
            # Label does not exist
            # Add label to returnDic
            returnDic[label] = otherDic[label]

        else:
            # Check for sub-labels
            toAddDic = {}
            
            for sub_label in otherDic[label]:
                if(sub_label not in baseDic[label]):
                    toAddDic[sub_label] = {}

            if(toAddDic != {}):
                returnDic[label] = toAddDic

    return returnDic

def getOverlap(baseDic, otherDic):
    returnDic = {}

    for label in otherDic:
        if(label in baseDic):
            if(baseDic[label] == {}):
                returnDic[label] = {}
            else:
                # Check for sub-labels
                toAddDic = {}
                
                for sub_label in otherDic[label]:
                    if(sub_label in baseDic[label]):
                        toAddDic[sub_label] = {}

                if(toAddDic != {}):
                    returnDic[label] = toAddDic

    return returnDic

def categoriesToTags(categories):
    returnList = []

    for label in categories:
        if(categories[label] == {}):
            returnList.append("[T:"+label+"]")
        else:
            for sub_label in categories[label]:
                returnList.append("[T:" + label + "-" + sub_label + "]")

    return returnList

def printListPretty(list):
    for e in list:
        print(e)

def generateReport(data, pathFile, overlapTags=True, generateDifferences=False):
    # Initialize return data structure
    ret = {}

    # Get a usable data structure of existing categories
    existingCategories = generateExistingCategories(data)

    # Extract tags from the file
    tags = getTags(pathFile)

    # Transform the tags data structure into one like existing categories more usable
    categories = tagsToCategories(tags)



    existingLabelsList = categoriesToTags(existingCategories)
    differenceList = categoriesToTags(getDifference(existingCategories, categories))
    overlapList = categoriesToTags(getOverlap(existingCategories, categories))



    nbExistingLabels = len(existingLabelsList)
    nbNewLabel = len(differenceList)
    nbOverlapLabel = len(overlapList)


    if(overlapTags):
        printListPretty(differenceList)


    print("Number of existing labels: {}".format(nbExistingLabels))
    print("Number of new label created: {}".format(nbNewLabel))
    print("Number of overlapping labels: {}".format(nbOverlapLabel))
    print("Number of label assigned: {}".format(nbNewLabel + nbOverlapLabel))

    ret["nbExistingLabels"] = nbExistingLabels
    ret["nbNewLabel"] = nbNewLabel
    ret["nbOverlapLabel"] = nbOverlapLabel
    ret["nbAssignedLabel"] = nbNewLabel + nbOverlapLabel
    ret["ratio"] = nbOverlapLabel / (nbNewLabel + nbOverlapLabel)
    if(generateDifferences):
        ret["differenceList"] = differenceList

    return ret

def checkDataConsistency(data, pathFile):
    # Get a usable data structure of existing categories
    existingCategories = generateExistingCategories(data)

    # Extract tags from the file
    tags = getTags(pathFile)

    # Transform the tags data structure into one like existing categories more usable
    categories = tagsToCategories(tags)

    differenceList = categoriesToTags(getDifference(existingCategories, categories))

    nbNewLabel = len(differenceList)

    # nbNewLabel = 0
    # print("Number of new label created: {}".format(nbNewLabel))
    return nbNewLabel == 0

def generateOne():
    data = datas[len(datas) - 1]
    fileName = files[len(files)-1]

    # Generate report for one file
    generateReport(data, pathFile.format(fileName))

def generateAll():
    # Generate for all files

    ret = {
        "nbExistingLabels":[],
        "nbNewLabel":[],
        "nbOverlapLabel":[],
        "nbAssignedLabel":[],
        "ratio":[],
    }


    for id, fileFinalName in enumerate(filesFinals):
        data = datas[id]
        print("     ###### {} #####".format(id+1))
        report = generateReport(data, pathFile.format(fileFinalName), overlapTags=False)

        for key in report:
            ret[key].append(report[key])

        print()
        
        if(id < len(datas) - 1):
            print("Consistency: {}".format(checkDataConsistency(datas[id + 1], pathFile.format(fileFinalName))))
        else:
            print("Consistency: can't check consistency of last file")

        print("")

    for id, ratio in enumerate(ret["ratio"]):
        ret["ratio"][id] = float("{:.2f}".format(ratio))

    return ret
        
def checkDatas():
    for id, data in enumerate(datas):
        if(id == len(datas) - 1):
            break
        ratio = reportDatas(id+1, id, True)
        print(ratio)

def reportDatas(dicId1, dicId2, printInfo=False):
    data1 = generateExistingCategories(datas[dicId1])
    data2 = generateExistingCategories(datas[dicId2])

    differenceList = categoriesToTags(getDifference(data1, data2))
    overlapList = categoriesToTags(getOverlap(data1, data2))


    nbNewLabel = len(differenceList)
    nbOverlapLabel = len(overlapList)


    if(printInfo):
        printListPretty(differenceList)
        print("Number of new label created: {}".format(nbNewLabel))
        print("Number of overlapping labels: {}".format(nbOverlapLabel))

    if((nbNewLabel + nbOverlapLabel) == 0):
        ratio = None
    else:
        ratio = nbOverlapLabel / (nbNewLabel + nbOverlapLabel)
    return ratio

def generateRatioGraph(show=False):
    report = generateAll()
    print(report)
    ratios = report["ratio"]
    ratios = [1-x for x in ratios]
    nbNewLabels = report["nbNewLabel"]
    nbNewLabels = [x for x in nbNewLabels]
    
    interviewIds = [x+1 for x, _ in enumerate(ratios)]

    fig,ax = plt.subplots()
    plt.ylim(0, 1.0)
    ax.plot(interviewIds, ratios)
    ax.set_ylabel('New labels proportion', color="blue")
    ax.set_xlabel('Interview Id')

    ax2 = ax.twinx()
    plt.ylim(0, max(nbNewLabels))
    ax2.plot(interviewIds, nbNewLabels, color="red")
    ax2.set_ylabel('# New labels', color="red")

    if(show):
        plt.show()
    else:
        plt.savefig(pathGraphs.format("ratio"), bbox_inches='tight')
        plt.clf()

def generateAbsoluteGraphs(show=False):
    report = generateAll()

    interviewIds = [x+1 for x, _ in enumerate(report["ratio"])]
    authorsComparison = generateAuthorsComparison()
    print(len(interviewIds))
    print(len(authorsComparison["differenceList"]))
    print(authorsComparison["differenceList"])
    if(len(interviewIds) == len(authorsComparison["differenceList"])):
        report["authors lists distance"] = authorsComparison["differenceList"]
    del report["ratio"]

    for graphName in report:
        values = report[graphName]

        plt.xlabel("Interview ID")
        plt.ylabel(graphName)
        m = max(values)
        plt.ylim(0, m + 0.1*m)

        plt.bar(interviewIds, values)

        if(show):
            plt.show()
        else:
            plt.savefig(pathGraphs.format(graphName), bbox_inches='tight')
            plt.clf()
        pass


def generateGraph():
    report = generateAll()

    nbExistingLabels = report["nbExistingLabels"]
    nbNewLabel = report["nbNewLabel"]
    nbOverlapLabel = report["nbOverlapLabel"]

    width = 0.70

    alignOverlap = [x-(nbOverlapLabel[id]) for id, x in enumerate(nbExistingLabels)]

    labelsNew = [x + 1 for x, _ in enumerate(nbExistingLabels)]
    labelsOverlap = [x + 1 + width*2/4 for x, _ in enumerate(nbExistingLabels)]
    labelsExisting = [x + 1 - width*2/4 for x, _ in enumerate(nbExistingLabels)]

    fig, ax = plt.subplots()

    ax.bar(labelsNew, nbExistingLabels, width, label='Existing')
    ax.bar(labelsNew, nbOverlapLabel, width, bottom=alignOverlap, label='Overlap')
    ax.bar(labelsNew, nbNewLabel, width, bottom=nbExistingLabels, label='New')


    ax.legend()
    plt.ylabel('Number of projects')
    plt.xlabel('Letter queried')

    fig.tight_layout()
    plt.show()

    pass

def countStructureToPickerDataStructure(countStructure):
    latestData = datas[-1]
    # Convert the tagsCounter datastructure into one usable by the label picker
    ret = {}
    for theme in latestData:

        totalOfOccurence = 0
        dtTemp1 = {}

        for label in latestData[theme]:

            if(latestData[theme][label] == {}):
                if(label in countStructure):
                    nbOfOccurence = countStructure[label]
                else:
                    nbOfOccurence = 0
                totalOfOccurence += nbOfOccurence

                dtTemp1[label + "\n" + str(nbOfOccurence)] = {}

            else:
                tempTotalOfOccurence = 0
                dtTemp2 = {}

                for subLabel in latestData[theme][label]:
                    if(label + "-" + subLabel in countStructure):
                        nbOfOccurence = countStructure[label + "-" + subLabel]
                    else:
                        nbOfOccurence = 0

                    dtTemp2[subLabel + "\n" + str(nbOfOccurence)] = {}

                    tempTotalOfOccurence += nbOfOccurence

                dtTemp1[label + "\n" + str(tempTotalOfOccurence)] = copy.deepcopy(dtTemp2)


                totalOfOccurence += tempTotalOfOccurence

        ret[theme + "\n" + str(totalOfOccurence)] = copy.deepcopy(dtTemp1)
        
    return ret

def tagsToData(tags, latestData=None):
    if(latestData is None):
        latestData = datas[-1]
    # Convert the tagsCounter datastructure into one usable by the label picker
    ret = {}
    for theme in latestData:
        added1 = False
        dtTemp1 = {}

        for label in latestData[theme]:
            if(latestData[theme][label] == {}):
                if(label in tags):
                    added1 = True
                    dtTemp1[label] = {}

            else:
                dtTemp2 = {}

                added2 = False
                for subLabel in latestData[theme][label]:
                    if(label + "-" + subLabel in tags):
                        dtTemp2[subLabel] = {}
                        added2 = True

                if(added2):
                    added1 = True
                    dtTemp1[label] = copy.deepcopy(dtTemp2)

        if(added1):
            ret[theme] = copy.deepcopy(dtTemp1)
        
    return ret

def generateLabelPickerDataStructureAbsolute():
    tagsCounter = {}
    
    for filePath in filesFinals:
        tags = getTags(pathFile.format(filePath))
        for tag in tags:
            if(tag not in tagsCounter):
                tagsCounter[tag] = 1
            else:
                tagsCounter[tag] += 1

    # tagsCounter is a dic storing the number of occurence of each tag

    print(countStructureToPickerDataStructure(tagsCounter))

def generateLabelPickerDataStructureOccurenceAcc():
    # nb of occurence of a tags across interviews
    tagsCounter = {}
    
    for filePath in filesFinals:
        tags = removeDuplicates(getTags(pathFile.format(filePath)))
        for tag in tags:
            if(tag not in tagsCounter):
                tagsCounter[tag] = 1
            else:
                tagsCounter[tag] += 1

    # tagsCounter is a dic storing the number of occurence of each tag
    print(countStructureToPickerDataStructure(tagsCounter))
    
def countStructureToPickerDataStructurePerInterview(countStructure):
    latestData = datas[-1]
    # Convert the tagsCounter datastructure into one usable by the label picker
    ret = {}
    for theme in latestData:

        totalOfOccurence = 0
        dtTemp1 = {}
        themeIds = []

        for label in latestData[theme]:

            if(latestData[theme][label] == {}):
                if(label in countStructure):
                    nbOfOccurence = countStructure[label]["counter"]
                    dtTemp1[label + "\n" + str(nbOfOccurence)] = countStructure[label]["ids"]

                    for id_ in countStructure[label]["ids"]:
                        if(id_ not in themeIds):
                            themeIds.append(id_)
                else:
                    nbOfOccurence = 0
                    dtTemp1[label + "\n" + str(nbOfOccurence)] = {}

                if(nbOfOccurence > totalOfOccurence):
                    totalOfOccurence = nbOfOccurence

                

            else:
                tempTotalOfOccurence = 0
                dtTemp2 = {}
                labelIds = []

                for subLabel in latestData[theme][label]:
                    if(label + "-" + subLabel in countStructure):
                        nbOfOccurence = countStructure[label + "-" + subLabel]["counter"]

                        dtTemp2[subLabel + "\n" + str(nbOfOccurence)] = countStructure[label + "-" + subLabel]["ids"]

                        for id_ in countStructure[label + "-" + subLabel]["ids"]:
                            if(id_ not in labelIds):
                                labelIds.append(id_)
                            if(id_ not in themeIds):
                                themeIds.append(id_)
                    else:
                        nbOfOccurence = 0

                        dtTemp2[subLabel + "\n" + str(nbOfOccurence)] = {}

                    if(nbOfOccurence > tempTotalOfOccurence):
                        tempTotalOfOccurence = nbOfOccurence

                dtTemp1[label + "\n" + str(len(labelIds))] = copy.deepcopy(dtTemp2)


                if(tempTotalOfOccurence > totalOfOccurence):
                    totalOfOccurence = tempTotalOfOccurence

        ret[theme + "\n" + str(len(themeIds))] = copy.deepcopy(dtTemp1)
        
    return ret
    
def generateLabelPickerDataStructureOccurencePerInterview():
    # nb of occurence of a tags across interviews
    tagsCounter = {}
    
    for id, filePath in enumerate(filesFinals):
        tags = removeDuplicates(getTags(pathFile.format(filePath)))
        for tag in tags:
            if(tag not in tagsCounter):
                tagsCounter[tag] = {
                    "counter":1,
                    "ids": {
                        str(id+1): {}
                    }
                }
            else:
                tagsCounter[tag]["counter"] += 1
                tagsCounter[tag]["ids"][str(id+1)] = {}


    # tagsCounter is a dic storing the number of occurence of each tag
    print(countStructureToPickerDataStructurePerInterview(tagsCounter))

def graphCountLabels(show=False):
    # nb of occurence of a tags across interviews
    tagsCounter = {}
    
    for id, filePath in enumerate(filesFinals):
        tags = removeDuplicates(getTags(pathFile.format(filePath)))
        for tag in tags:
            if(tag not in tagsCounter):
                tagsCounter[tag] = {
                    "counter":1,
                    "ids": {
                        str(id): {}
                    }
                }
            else:
                tagsCounter[tag]["counter"] += 1
                tagsCounter[tag]["ids"][str(id)] = {}

    nbLabels = [0 for _ in filesFinals]
    occurences = [x+1 for x, _ in enumerate(filesFinals)]
    for tag in tagsCounter:
        nbLabels[tagsCounter[tag]["counter"] - 1] += 1
        

    plt.xlabel("Occurences")
    plt.ylabel("Nb labels")
    m = max(nbLabels)
    plt.ylim(0, m + 0.1*m)

    plt.bar(occurences, nbLabels)

    if(show):
        plt.show()
    else:
        plt.savefig(pathGraphs.format("countLabels"), bbox_inches='tight')
        plt.clf()

def graphCountLabelsOcc1PerInterview(show=False):
    # nb of occurence of a tags across interviews

    interviewId = [x+1 for x, _ in enumerate(filesFinals)]
    nbLabels = []
    labels = []
    tagsCounter = {}
    
    for id, filePath in enumerate(filesFinals):
        tags = removeDuplicates(getTags(pathFile.format(filePath)))
        labels.append(tags)
        for tag in tags:
            if(tag not in tagsCounter):
                tagsCounter[tag] = {
                    "counter":1,
                    "ids": {
                        str(id): {}
                    }
                }
            else:
                tagsCounter[tag]["counter"] += 1
                tagsCounter[tag]["ids"][str(id)] = {}

    for labelList in labels:
        count1 = 0
        for label in labelList:
            if(tagsCounter[label]["counter"] == 1):
                count1 += 1
        nbLabels.append(count1)


        

    plt.xlabel("Interview Id")
    plt.ylabel("Nb labels with 1 occurence")
    m = 60
    plt.ylim(0, m + 0.1*m)

    plt.bar(interviewId, nbLabels)

    if(show):
        plt.show()
    else:
        plt.savefig(pathGraphs.format("countLabelsPerInterview"), bbox_inches='tight')
        plt.clf()

def graphEvolutionOcc1AndNewLabels(show=False):
    # nb of occurence of a tags across interviews
    report = generateAll()
    nbNewLabels = report["nbNewLabel"]

    interviewId = [x+1 for x, _ in enumerate(filesFinals)]
    nbLabels = []
    labels = []
    tagsCounter = {}
    
    for id, filePath in enumerate(filesFinals):
        tags = removeDuplicates(getTags(pathFile.format(filePath)))
        labels.append(tags)
        for tag in tags:
            if(tag not in tagsCounter):
                tagsCounter[tag] = {
                    "counter":1,
                    "ids": {
                        str(id): {}
                    }
                }
            else:
                tagsCounter[tag]["counter"] += 1
                tagsCounter[tag]["ids"][str(id)] = {}

    for labelList in labels:
        count1 = 0
        for label in labelList:
            if(tagsCounter[label]["counter"] == 1):
                count1 += 1
        nbLabels.append(count1)


        

    fig,ax = plt.subplots()
    plt.ylim(0, max(nbNewLabels))
    ax.bar(interviewId, nbLabels)
    ax.set_ylabel('# Labels used once', color="blue")
    ax.set_xlabel('Interview Id')

    ax2 = ax.twinx()
    plt.ylim(0, max(nbNewLabels))
    ax2.plot(interviewId, nbNewLabels, color="red")
    ax2.set_ylabel('# Labels generated', color="red")


    if(show):
        plt.show()
    else:
        plt.savefig(pathGraphs.format("countLabelsPerInterviewAndOcc"), bbox_inches='tight')
        plt.clf()



def getByTheme(theme):
    # get all tag associated to the theme
    data = datas[len(datas) - 1]

    specificData = {
        theme: data[theme]
    }

    tags = categoriesToTags(generateExistingCategories(specificData))

    return printParagraphs(tags)


def getByLabel(theme, label):
    # get all tag associated to the label
    data = datas[len(datas) - 1]

    specificData = {
        theme: {
            label: data[theme][label]
        }
    }

    tags = categoriesToTags(generateExistingCategories(specificData))

    return printParagraphs(tags)


def getBySubLabel(label, sublabel):
    return printParagraphs(["[T:{}-{}]".format(label, sublabel)])


def printParagraphs(tags, printBool=True):
    # Clean tags because they are coming formatted [T:....]
    tempTags = []
    for tag in tags:
        tempTags.append(tag[3:-1])
    tags = tempTags

    # Process
    ret = {}
    for id, file in enumerate(filesFinals):
        ret[id] = []
        if(printBool):
            print("######## INTERVIEW #" + str(id+1) + " ########\n")
        # print: TAG + associated paragraph
        
        f = open(pathFile.format(file), 'r', encoding="utf8")

        found = False
        # print lines
        for line in f:
            tagsFound = getTagsFromLine(line)

            if(tagsFound == [] and found):
                if(printBool):
                    print(line)
                ret[id].append(line)

            else:
                found = False
                # print(tagsFound)
                for tag in tagsFound:
                    
                    if(tag in tags):
                        found = True
                        break

                if(found):
                    if(printBool):
                        print(line)
                    ret[id].append(line)

        if(printBool):
            print()

    return ret


def getZeroOccurenceLabels():
    tags = categoriesToTags(generateExistingCategories(datas[len(datas) - 1]))
    print(len(tags))

    c= 0
    for tag in tags:
        occurencesDic = printParagraphs([tag], printBool=False)

        occ = 0
        for fileId in occurencesDic:
            occ += len(occurencesDic[fileId])

        if(occ == 0):
            c += 1
            print(tag)
    print(c)


def generateDatas(lastData):
    datas = [
        {}
    ]

    data = {}
    tagsIncremental = []
    for id, fileName in enumerate(filesFinals):

        # For each tag in file
        tags = getTags(pathFile.format(fileName))
        tagsIncremental += tags
        data = tagsToData(tagsIncremental, datasRevisedManually)

        datas.append(copy.deepcopy(data))

    return datas

def printLatex(data, id):
    print('\\begin{longtable}{| l | l | l |}\\hline')
    print('   Theme & Label & Sub-label \\\\\\hline\\hline')
    label = ''
    sub_label = ''
    stringSizeLimit = 20
    for theme in data:
        labels = data[theme]

        if(len(theme) > stringSizeLimit):
            themeFormatted = "\\\\".join([theme[i:i+stringSizeLimit] for i in range(0, len(theme), stringSizeLimit)])
            theme = '\makecell[l]{{{themeFormatted}}}'.format(themeFormatted=themeFormatted)

        countTheme = 0

        l = ''
        ltemp = ''
        for label in labels:
            sub_labels = labels[label]

            l_1 = [""]
            if(len(label) > stringSizeLimit):
                l_1 = [label[i:i+stringSizeLimit] for i in range(0, len(label), stringSizeLimit)]
                labelFormatted = "\\\\".join(l_1)
                label = '\makecell[l]{{{labelFormatted}}}'.format(labelFormatted=labelFormatted)

            l += ltemp
            countLabel = 0


            if(sub_labels == {}):
                countTheme += 1
                ltemp = '   &\\multirow{{{countLabel}}}{{*}}{{{label}}}&\\\\\n'.format(countLabel='1', label=label) + '   \\cline{2-3}\n'
                sub_label = ''
                s = ''

            else:
                s = ""
                stemp = ''
                for sub_label in sub_labels:

                    l_ = [""]
                    if(len(sub_label) > stringSizeLimit):
                        l_ = [sub_label[i:i+stringSizeLimit] for i in range(0, len(sub_label), stringSizeLimit)]
                        sub_labelFormatted = "\\\\".join(l_)
                        sub_label = '\makecell[l]{{{sub_labelFormatted}}}'.format(sub_labelFormatted=sub_labelFormatted)
                    countLabel += 1
                    countTheme += 1

                    s += stemp
                    stemp = '   &&{sub_label}\\\\\n'.format(sub_label=sub_label)

                if(countLabel > 1):
                    ltemp = '   &\\multirow{{{countLabel}}}{{*}}{{{label}}}&{sub_label}\\\\\n'.format(countLabel=countLabel, label=label, sub_label=sub_label) + s + '   \\cline{2-3}\n'
                else:
                    ltemp = '   &{label}&{sub_label}\\\\\n'.format(label=label, sub_label=sub_label) + s + '   \\cline{2-3}\n'
        #print(l)
        if(countLabel > 1):
            tempS = '\\multirow{{{countLabel}}}{{*}}{{{label}}}'.format(label=label, countLabel=countLabel)
        else:
            tempS = '{label}'.format(label=label)

        if(countTheme > 1):
            print('   \\multirow{{{countTheme}}}{{*}}{{{theme}}}&{tempS}&{sub_label}\\\\\n'.format(countTheme=countTheme, theme=theme, tempS=tempS, sub_label=sub_label) + s + '   \\cline{2-3}\n' + l + '   \\hline\n')
        else:
            print('   {theme}&{tempS}&{sub_label}\\\\\n'.format(theme=theme, tempS=tempS, sub_label=sub_label) + s + '   \\cline{2-3}\n' + l + '   \\hline\n')

    

    print('   \\caption{{Themes, labels and sub-labels generated by coding the interview n°{interviewId}}}\\label{{tab:labels{interviewId}}}'.format(interviewId=str(id)))
    print('\\end{longtable}')
    print('\n\\newpage')

def generateDatasLatexTables():
    tagsIncremental = []
    for id, fileName in enumerate(filesFinals):

        # For each tag in file
        tags = getTags(pathFile.format(fileName))

        differentTags = [tag for tag in tags if tag not in tagsIncremental]
        tagsIncremental += tags
        differentData = tagsToData(differentTags, datas[len(datas) - 1])


        printLatex(differentData, id)
        print()


    # Print full table
    fullData = tagsToData(tagsIncremental, datasRevisedManually)
    printLatex(fullData, id)


def getDistanceLists(l1, l2):
    dist = 0
    for e in l1:
        if(e not in l2):
            dist += 1
    for e in l2:
        if(e not in l1):
            dist += 1

    return dist

def generateAuthorsComparison():
    path = pathOldFiles
    structureReport = {
        "nbExistingLabels":[],
        "nbNewLabel":[],
        "nbOverlapLabel":[],
        "nbAssignedLabel":[],
        "ratio":[],
        "differenceList": []
    }

    ret = {
        "l": copy.deepcopy(structureReport),
        "s": copy.deepcopy(structureReport),
        "y": copy.deepcopy(structureReport)
    }
    differenceList = []

    dataStructureUsed = datasOriginal

    id = 0
    y = []
    l = []
    for fileName in files:
        if(fileName == firstRevisedCodedFile):
            # When we reach the first file that have been coded with the revised datas. Swap the data structure in use
            dataStructureUsed = datas
            path = pathFile

        data = dataStructureUsed[id]

        report = generateReport(data, path.format(fileName), overlapTags=False, generateDifferences=True)

        lastLetter = fileName[-1]
        if(lastLetter == "y"):
            y = report["differenceList"]
        elif(lastLetter == "s"):
            s = report["differenceList"]

        for key in report:
            ret[fileName[-1]][key].append(report[key])

        if(fileName[-1] == 's'):
            id += 1
            differenceList.append(getDistanceLists(y, s))
    
    for lastLetter in ret:    
        for id, ratio in enumerate(ret[lastLetter]["ratio"]):
            ret[lastLetter]["ratio"][id] = float("{:.2f}".format(ratio))

    ret["differenceList"] = differenceList
    return ret


print(os.path.dirname(__file__))
pathOldFiles = os.path.join(os.path.dirname(__file__), 'first_round_coding_back_up', '{}.txt')
pathFile = os.path.join(os.path.dirname(__file__), 'first_round_coding', '{}.txt')
pathGraphs = os.path.join(os.path.dirname(__file__), 'graphs', '{}.txt')

filesFinals = [
    "2022-03-30 coded transcript final",
    "2022-04-05 09_30 coded transcript final",
    "2022-04-05 14_00 transcript coded final",
    "2022-04-05 17_00 transcript coded final",
    "2022-04-06 09-32 transcript coded final",
    "2022-04-07 09-03 transcript coded final",
    "2022-04-19 15-04 transcript coded final",
    "2022-04-20 09-30 transcript coded final",
    "2022-04-20 16_03 transcript coded final",
    "2022-04-22 12_35 transcript coded final",
    "2022-04-23 11-01 transcript coded final",
    "2022-04-27 15-02 transcript coded final"
]

files = [
    "2022-03-30 coded transcript anthony",
    "2022-03-30 coded transcript aniss",
    "2022-03-30 coded transcript final",
    "2022-04-05 09_30 coded transcript anthony",
    "2022-04-05 09_30 coded transcript aniss",
    "2022-04-05 09_30 coded transcript final",
    "2022-04-05 14_00 transcript coded anthony",
    "2022-04-05 14_00 transcript coded aniss",
    "2022-04-05 14_00 transcript coded final",
    "2022-04-05 17_00 transcript coded anthony",
    "2022-04-05 17_00 transcript coded aniss",
    "2022-04-05 17_00 transcript coded final",
    "2022-04-06 09-32 transcript coded anthony",
    "2022-04-06 09-32 transcript coded aniss",
    "2022-04-06 09-32 transcript coded final",
    "2022-04-07 09-03 transcript coded anthony",
    "2022-04-07 09-03 transcript coded aniss",
    "2022-04-07 09-03 transcript coded final",
    "2022-04-19 15-04 transcript coded anthony",
    "2022-04-19 15-04 transcript coded aniss",
    "2022-04-19 15-04 transcript coded final",
    "2022-04-20 09-30 transcript coded anthony",
    "2022-04-20 09-30 transcript coded aniss",
    "2022-04-20 09-30 transcript coded final",
    "2022-04-20 16_03 transcript coded anthony",
    "2022-04-20 16_03 transcript coded aniss",
    "2022-04-20 16_03 transcript coded final",
    "2022-04-22 12_35 transcript coded anthony",
    "2022-04-22 12_35 transcript coded aniss",
    "2022-04-22 12_35 transcript coded final",
    "2022-04-23 11-01 transcript coded anthony",
    "2022-04-23 11-01 transcript coded aniss",
    "2022-04-23 11-01 transcript coded final",
    "2022-04-27 15-02 transcript coded anthony",
    "2022-04-27 15-02 transcript coded aniss",
    "2022-04-27 15-02 transcript coded final"
]

firstRevisedCodedFile = "2022-04-22 12_35 transcript coded anthony"


generateAllReports = False
queryText = True
# Set the following to True to not trigger the regular process and instead uncomment the custom one
customProcess = False


if(customProcess):
    # generateDatasLatexTables()
    # print(generateDatas(datas[len(datas) - 1]))

    # generateLabelPickerDataStructureAbsolute()
    # getZeroOccurenceLabels()
    # generateLabelPickerDataStructureOccurence()

    # print(generateAuthorsComparison())
    generateLabelPickerDataStructureOccurencePerInterview()

    # Add generate occurence of theme and of labels

    # graphEvolutionOcc1AndNewLabels()
    # generateAbsoluteGraphs()
    # generateRatioGraph()
    # graphCountLabels()
    # graphCountLabelsOcc1PerInterview()

    # checkDatas()

    # data = datas[len(datas)-1]
    # fileName = filesFinals[len(filesFinals) - 1]
    # generateReport(data, pathFile.format(fileName))
    pass

elif(queryText):
    # Uncomment the one you want to use

    # Param: Theme
    # getByTheme("USAGE") 

    # Param: Theme, Label
    # getByLabel("TARGET_USER", "STRONG_INDIVIDUALS")

    # Param: Label, Sub-LabelT:LEGEND_SCALE_DIRECTION-NOT_INTUITIVE
    getBySubLabel("MAINTAINABILITY_METRIC", "CONFUSING")

    pass
else:
    if(generateAllReports):
        ratios = generateAll()
        print(ratios)

    else:
        data = datas[len(datas) - 1]
        fileName = files[len(files)-1]

        # Generate report for one file
        generateReport(data, pathFile.format(fileName))